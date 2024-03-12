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
  getSdkError: jest.fn().mockReturnValue('USER_DISCONNECTED'),
  parseUri: jest.fn(),
}));

jest.mock('../utils/WalletConnectUtil', () => ({
  createWeb3Wallet: jest.fn(),
  web3wallet: {
    approveSession: jest.fn(),
    disconnectSession: jest.fn(),
    getActiveSessions: jest.fn(),
    respondSessionRequest: jest.fn(),
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
      signMessage: jest.fn().mockResolvedValue('signedMessageMock'),
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

  describe('disconnectSession error handling', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockReset();
    });
    it('handles no active sessions', async () => {
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce({}); // No active sessions

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

  describe('useWalletConnect useEffect', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });
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
    it('calls onApprove with correct arguments for session proposal without existing session', async () => {
      // Set up the mock to simulate no existing sessions
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce({}); // Assume no sessions match

      const { result } = renderHook(() => useWalletConnect());
      const mockSessionProposal = {
        id: 'mockId',
        params: {},
        verifyContext: {
          verified: { origin: 'mockDApp' },
        },
      };

      act(() => {
        triggerEvent('session_proposal', mockSessionProposal);
      });

      await waitFor(() => {
        // Assuming onApprove updates isLoadingApprove to true when called
        expect(result.current.isLoadingApprove).toBe(true);
        // If possible, directly verify that onApprove was called with the expected arguments
        // This may require additional mocking or a different approach to track calls to internal functions
      });
    });

    it('does not call onApprove for session proposal with existing session', async () => {
      // Simulate an existing session matching the dApp
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce({
        mockSessionId: {
          peer: {
            metadata: {
              url: 'https://example.com/dummy/',
            },
          },
          namespaces: {
            eip155: {
              accounts: [`eip155:1:mockedAddress2`],
            },
          },
        },
        mockSessionId2: {
          peer: {
            metadata: {
              url: 'https://example.com/dummy/',
            },
          },
          namespaces: {
            eip155: {
              accounts: [`eip155:1:mockedAddress`],
            },
          },
        },
      });
      const { result } = renderHook(() => useWalletConnect());
      const mockSessionProposal = {
        id: 'mockId',
        params: {
          /* mock params */
        },
        verifyContext: {
          verified: { origin: 'https://example.com' },
        },
      };
      act(() => {
        triggerEvent('session_proposal', mockSessionProposal);
      });

      await waitFor(() => {
        // Assuming onApprove updates isLoadingApprove to true when called
        expect(result.current.isConnectedToDapp).toBe(true);
      });
      expect(
        WalletConnectUtils.web3wallet.approveSession,
      ).not.toHaveBeenCalled();
    });

    it('handles session deletion correctly when no matching topic', async () => {
      const { result } = renderHook(() => useWalletConnect());

      // Mock a session deletion event
      const mockSessionDelete = {
        topic: 'mockTopic',
      };

      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce({}); // Assume no sessions match

      act(() => {
        triggerEvent('session_delete', mockSessionDelete);
      });

      await waitFor(() => {
        expect(
          WalletConnectUtils.web3wallet.disconnectSession,
        ).not.toHaveBeenCalled();
      });
    });

    it('handles session deletion correctly when matching topic', async () => {
      const { result } = renderHook(() => useWalletConnect());

      // Mock a session deletion event
      const mockSessionDelete = {
        topic: 'mockTopic',
      };

      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce({
        mockTopic: {
          peer: {
            metadata: {
              url: 'https://example.com/dummy/',
            },
          },
          namespaces: {
            eip155: {
              accounts: [`eip155:1:mockedAddress`],
            },
          },
        },
      }); // Assume no sessions match

      act(() => {
        triggerEvent('session_delete', mockSessionDelete);
      });

      await waitFor(() => {
        expect(WalletConnectUtils.web3wallet.disconnectSession).toBeCalledWith({
          topic: 'mockTopic',
          reason: 'USER_DISCONNECTED',
        });
        expect(result.current.isConnectedToDapp).toBe(false);
      });
    });

    it('handles session request when wallet is present', async () => {
      const { result } = renderHook(() => useWalletConnect());
      const mockRequest = {
        topic: 'mockTopic',
        params: {
          request: {
            params: ['mockRequestParamsMessage'],
          },
        },
        id: 'mockId',
      };

      act(() => {
        triggerEvent('session_request', mockRequest);
      });

      await waitFor(() => {
        expect(
          WalletConnectUtils.web3wallet.respondSessionRequest,
        ).toHaveBeenCalledWith({
          topic: 'mockTopic',
          response: {
            id: 'mockId',
            result: 'signedMessageMock',
            jsonrpc: '2.0',
          },
        });
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

      await act(async () => {
        await result.current.connectToDapp('mockUri');
      });

      await waitFor(() => {
        expect(result.current.isLoadingPairing).toBe(false);
        // Assertions to verify successful connection
        expect(WalletConnectUtils.web3wallet.pair).toHaveBeenCalled();
      });
    });

    it('throws an error when connection fails', async () => {
      (WalletConnectUtils.web3wallet.pair as jest.Mock).mockRejectedValue(
        new Error('Connection error'),
      ); // Mock failed pairing

      const { result } = renderHook(() => useWalletConnect());
      await act(async () => {
        await expect(result.current.connectToDapp('mockUri')).rejects.toThrow(
          'Connection error',
        );
      });

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
        namespaces: {
          eip155: {
            accounts: [`eip155:1:mockedAddress`],
          },
        },
      },
      session2: {
        peer: { metadata: { url: 'https://anotherdomain.com/dapp' } },
        namespaces: {
          eip155: {
            accounts: [`eip155:1:mockedAddress`],
          },
        },
      },
    };

    beforeEach(() => {
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValueOnce(mockActiveSessions);
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockReset();
    });
    it('disconnects from WalletConnect sessions successfully', async () => {
      (
        WalletConnectUtils.web3wallet.disconnectSession as jest.Mock
      ).mockResolvedValueOnce(true);

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
  });

  describe('initializeWalletConnect function', () => {
    beforeEach(() => {
      Object.defineProperty(document, 'referrer', {
        value: 'https://example.com',
        configurable: true,
      }); // Mocking embeddingPageUrl
    });
    it('initializes WalletConnect successfully without existing session', async () => {
      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValue({});
      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.initializeWalletConnect('mockAddress');
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
        expect(result.current.isConnectedToDapp).toBe(false);
      });
    });
    it('initializes WalletConnect with an existing session', async () => {
      const mockActiveSessions = {
        mockSessionId2: {
          peer: {
            metadata: {
              url: 'https://example.com/dummy/',
            },
          },
          namespaces: {
            eip155: {
              accounts: [`eip155:1:mockedAddress`],
            },
          },
        },
      };

      (
        WalletConnectUtils.web3wallet.getActiveSessions as jest.Mock
      ).mockReturnValue(mockActiveSessions);

      const { result } = renderHook(() => useWalletConnect());

      await act(async () => {
        await result.current.initializeWalletConnect('mockedAddress');
      });

      await waitFor(() => {
        expect(result.current.isReady).toBe(true);
        expect(result.current.isConnectedToDapp).toBe(true);
      });
    });
  });
});
