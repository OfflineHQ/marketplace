import * as WalletConnectUtilsLib from '@walletconnect/utils';
import * as WalletConnectUtils from '../utils/WalletConnectUtil'; // Adjust the import path as necessary

import { act, renderHook, waitFor } from '@testing-library/react';
import { useWalletConnect } from './useWalletConnect'; // Adjust the import path as necessary

// Mock dependencies
jest.mock('@walletconnect/encoding', () => ({
  hexToUtf8: jest.fn().mockImplementation((hex) => hex),
}));

jest.mock('@walletconnect/utils', () => ({
  buildApprovedNamespaces: jest.fn(),
  getSdkError: jest.fn().mockReturnValue('Mocked error'),
  parseUri: jest.fn(),
}));

jest.mock('../utils/WalletConnectUtil', () => ({
  createWeb3Wallet: jest.fn(),
  web3wallet: {
    approveSession: jest.fn(),
    disconnectSession: jest.fn(),
    getActiveSessions: jest.fn().mockReturnValue({}),
    pair: jest.fn(),
    on: jest.fn(),
    off: jest.fn(),
    core: {
      pairing: {
        events: {
          on: jest.fn(),
          off: jest.fn(),
          removeListener: jest.fn(),
        },
        getPairings: jest.fn().mockReturnValue([]),
      },
    },
  },
}));

jest.mock('./useWalletContext', () => ({
  useWalletContext: jest.fn().mockReturnValue({
    wallet: {
      getAddress: jest.fn().mockReturnValue('mockedAddress'),
    },
  }),
}));

// Helper function to simulate web3wallet events
const triggerEvent = (eventName, eventData) => {
  const callbacks = WalletConnectUtils.web3wallet.on.mock.calls
    .filter((call) => call[0] === eventName)
    .map((call) => call[1]);
  callbacks.forEach((callback) => callback(eventData));
};

describe('useWalletConnect', () => {
  it('initializes state variables correctly', () => {
    const { result } = renderHook(() => useWalletConnect());

    expect(result.current.isConnectedToDapp).toBe(false);
    expect(result.current.isLoadingPairing).toBe(false);
    expect(result.current.isReady).toBe(false);
    expect(result.current.isLoadingApprove).toBe(false);
    // Add assertions for other state variables as needed
  });

  describe('useWalletConnect useEffect', () => {
    it('registers and cleans up event listeners', () => {
      const { unmount } = renderHook(() => useWalletConnect());

      // Check that listeners were registered
      expect(WalletConnectUtils.web3wallet.on).toHaveBeenCalledWith(
        'session_proposal',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.on).toHaveBeenCalledWith(
        'session_delete',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.on).toHaveBeenCalledWith(
        'session_request',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.on).toHaveBeenCalledWith(
        'session_request_expire',
        expect.any(Function),
      );
      expect(
        WalletConnectUtils.web3wallet.core.pairing.events.on,
      ).toHaveBeenCalledWith('pairing_expire', expect.any(Function));

      // Unmount to trigger cleanup
      unmount();

      // Check that listeners were removed
      expect(WalletConnectUtils.web3wallet.off).toHaveBeenCalledWith(
        'session_proposal',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.off).toHaveBeenCalledWith(
        'session_delete',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.off).toHaveBeenCalledWith(
        'session_request',
        expect.any(Function),
      );
      expect(WalletConnectUtils.web3wallet.off).toHaveBeenCalledWith(
        'session_request_expire',
        expect.any(Function),
      );
      expect(
        WalletConnectUtils.web3wallet.core.pairing.events.off,
      ).toHaveBeenCalledWith('pairing_expire', expect.any(Function));
    });
    it('handles session proposals correctly', async () => {
      const { result } = renderHook(() => useWalletConnect());

      // Simulate a session proposal event
      const mockSessionProposal = {
        id: 'mockId',
        params: {
          /* mock params */
        },
        verifyContext: {
          verified: { origin: 'mockDApp' },
        },
      };

      act(() => {
        triggerEvent('session_proposal', mockSessionProposal);
      });

      await waitFor(() => {
        // Verify the hook reacts correctly (e.g., updates state, calls onApprove)
        expect(result.current.isLoadingApprove).toBe(true);
      });
    });
  });
  describe('connectToDapp function', () => {
    beforeEach(() => {
      (WalletConnectUtils.web3wallet.pair as jest.Mock).mockReset();
      (WalletConnectUtilsLib.parseUri as jest.Mock).mockReset();
      (WalletConnectUtils.web3wallet.pair as jest.Mock).mockResolvedValue(true); // Mock successful pairing
      (WalletConnectUtilsLib.parseUri as jest.Mock).mockReturnValue({
        topic: 'mockTopic',
      });
    });
    it('successfully establishes a connection', async () => {
      const { result } = renderHook(() => useWalletConnect());

      act(() => {
        result.current.connectToDapp('mockUri');
      });

      await waitFor(() => {
        expect(result.current.isLoadingPairing).toBe(false);
      });

      // Assertions to verify successful connection
      expect(WalletConnectUtils.web3wallet.pair).toHaveBeenCalled();
      // Add more assertions as necessary
    });

    it('throws an error when connection fails', async () => {
      (WalletConnectUtils.web3wallet.pair as jest.Mock).mockRejectedValue(
        new Error('Connection error'),
      ); // Mock failed pairing

      const { result } = renderHook(() => useWalletConnect());

      await expect(result.current.connectToDapp('mockUri')).rejects.toThrow(
        'Connection error',
      );

      expect(result.current.isLoadingPairing).toBe(false);
      // Add more assertions as necessary
    });

    it('parses URI and sets current pairing topic', async () => {
      const mockUri = 'wc:mockUri';
      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.connectToDapp(mockUri);
      });

      expect(WalletConnectUtilsLib.parseUri).toHaveBeenCalledWith(mockUri);
    });
    it('handles existing pairing', async () => {
      const mockUri = 'wc:mockUri';
      (
        WalletConnectUtils.web3wallet.core.pairing.getPairings as jest.Mock
      ).mockReturnValue([{ topic: 'existingTopic', active: true }]);
      (WalletConnectUtilsLib.parseUri as jest.Mock).mockReturnValue({
        topic: 'existingTopic',
      });

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.connectToDapp(mockUri);
      });

      expect(WalletConnectUtils.web3wallet.pair).not.toHaveBeenCalled();
    });
  });
  describe('onApprove function', () => {
    const mockProposal = {
      id: 124124,
      params: {
        supportedNamespaces: {
          eip155: {
            methods: ['eth_sendTransaction'],
            events: ['accountsChanged'],
          },
        },
      },
    };
    it('handles approval correctly', async () => {
      (
        WalletConnectUtils.web3wallet.approveSession as jest.Mock
      ).mockResolvedValue('mockSession');

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.onApprove(mockProposal);
      });

      // Assertions to verify the approval process
      expect(WalletConnectUtils.web3wallet.approveSession).toHaveBeenCalled();
      expect(result.current.isConnectedToDapp).toBe(true);
      // Add more assertions as needed
    });

    it('handles approval error', async () => {
      // Mock a failing scenario for approveSession
      (
        WalletConnectUtils.web3wallet.approveSession as jest.Mock
      ).mockRejectedValue(new Error('Approval error'));

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.onApprove(mockProposal);
      });

      // Assertions to verify error handling
      expect(result.current.isLoadingApprove).toBe(false);
      // Add more assertions as needed
    });
  });
  // Inside describe('useWalletConnect', () => { ... });

  describe('disconnectWalletConnect function', () => {
    // Mock sessions to test filtering and disconnection
    const mockActiveSessions = {
      session1: {
        peer: { metadata: { url: 'https://example.com/app' } },
      },
      session2: {
        peer: { metadata: { url: 'https://anotherdomain.com/dapp' } },
      },
    };

    beforeEach(() => {
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValue(mockActiveSessions);
      (WalletConnectUtilsLib.getSdkError as jest.Mock).mockReturnValue(
        'USER_DISCONNECTED',
      );
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockReset();
    });
    it('disconnects from WalletConnect sessions successfully', async () => {
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockResolvedValue(true);

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.disconnectWalletConnect();
      });

      // Verify disconnectSession is called for each active session
      expect(
        WalletConnectUtils.web3wallet.disconnectSession,
      ).toHaveBeenCalledTimes(Object.keys(mockActiveSessions).length);
      Object.keys(mockActiveSessions).forEach((topic) => {
        expect(
          WalletConnectUtils.web3wallet.disconnectSession,
        ).toHaveBeenCalledWith({
          topic,
          reason: 'USER_DISCONNECTED',
        });
      });
    });
    it('disconnects only from sessions matching the targetDAppIdentifier', async () => {
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockResolvedValue(true);

      const { result } = renderHook(() => useWalletConnect());
      const targetDApp = 'example.com'; // This should match the normalized URL of the first session

      await act(async () => {
        await result.current.disconnectWalletConnect(targetDApp);
      });

      // Verify disconnectSession is called only for the session matching the targetDAppIdentifier
      expect(
        WalletConnectUtils.web3wallet.disconnectSession,
      ).toHaveBeenCalledTimes(1);
      expect(
        WalletConnectUtils.web3wallet.disconnectSession,
      ).toHaveBeenCalledWith({
        topic: 'session1',
        reason: 'USER_DISCONNECTED',
      });
    });

    it('handles no active sessions', async () => {
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValue({}); // No active sessions

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.disconnectWalletConnect();
      });

      // Verify disconnectSession is not called when there are no active sessions
      expect(
        WalletConnectUtils.web3wallet.disconnectSession,
      ).not.toHaveBeenCalled();
    });
  });
});
