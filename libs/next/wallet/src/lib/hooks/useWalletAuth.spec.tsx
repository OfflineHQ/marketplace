import { act, renderHook, waitFor } from '@testing-library/react';
import { WalletProvider } from '../services/context'; // Adjust the import path as necessary
import { useWalletAuth } from './useWalletAuth';

jest.mock('next/navigation', () => ({
  useSearchParams: () => {
    return new URLSearchParams('wcUri=mockUri&address=mockAddress');
  },
  useRouter: () => ({
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/mock-path',
}));

// Mock the external modules used in your hook
jest.mock('@cometh/connect-sdk', () => {
  const originalModule = jest.requireActual('@cometh/connect-sdk');

  return {
    ...originalModule,
    ComethWallet: jest.fn().mockImplementation(() => ({
      connect: jest.fn().mockResolvedValue(true), // Ensure connect is a mocked function
      disconnect: jest.fn().mockResolvedValue(true), // Ensure disconnect is also mocked
      logout: jest.fn().mockResolvedValue(true), // Ensure logout is also mocked
      retrieveWalletAddressFromSigner: jest.fn().mockResolvedValue('0x1234'),
      getAddress: jest.fn().mockResolvedValue(['0x1234']),
      // Mock other methods as needed
    })),
    ConnectAdaptor: jest.fn().mockImplementation(() => ({
      // Mock any methods used from ConnectAdaptor here
    })),
  };
});

// Define a custom wrapper component that includes the WalletProvider
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <WalletProvider>{children}</WalletProvider>
);
describe('useWalletAuth', () => {
  beforeEach(() => {
    jest.mock('@env/client', () => ({
      NEXT_PUBLIC_COMETH_CONNECT_API_KEY: 'test',
    }));
    // jest.resetAllMocks();
  });

  it('should initialize state variables correctly', () => {
    const { result } = renderHook(() => useWalletAuth(), { wrapper });

    expect(result.current.wallet).toBeNull();
    expect(result.current.provider).toBeNull();
    expect(result.current.walletAdaptor).not.toBeNull();
    expect(result.current.isReady).toBe(true);
    expect(result.current.isConnecting).toBe(false);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.connectionError).toBeNull();
  });

  describe('useWalletAuth connectWithSiwe function', () => {
    it('should connect to wallet address and set state variables correctly', async () => {
      const { result } = renderHook(() => useWalletAuth(), { wrapper });

      act(() => {
        result.current.connectWithSiwe(jest.fn(), '0x1234');
      });

      await waitFor(() => expect(result.current.isConnected).toBe(true));
    });
    it('should handle connection with an address successfully', async () => {
      const { result } = renderHook(() => useWalletAuth(), { wrapper });
      const mockLoginSiwe = jest.fn();

      act(() => {
        result.current.connectWithSiwe(mockLoginSiwe, '0x1234');
      });

      await waitFor(() => expect(result.current.isConnected).toBe(true));
      expect(mockLoginSiwe).not.toHaveBeenCalled();
    });

    it('should handle connection without an address and create account flag true', async () => {
      const { result } = renderHook(() => useWalletAuth(), { wrapper });
      const mockLoginSiwe = jest.fn();

      act(() => {
        result.current.connectWithSiwe(mockLoginSiwe, undefined, true);
      });

      await waitFor(() => expect(result.current.isConnected).toBe(true));
      // Assuming connect() internally handles account creation and does not expose it
      // So, we just check if isConnected turns true
    });

    it('should handle connection error', async () => {
      const { result } = renderHook(() => useWalletAuth(), { wrapper });

      await expect(
        result.current.connectWithSiwe(
          jest.fn().mockRejectedValue(new Error('Connection failed')),
          undefined,
          true,
        ),
      ).rejects.toThrow('Connection failed');

      await waitFor(() =>
        expect(result.current.connectionError).toBe('Connection failed'),
      );
    });
  });
  it('should disconnect from wallet and set state variables correctly', async () => {
    const { result } = renderHook(() => useWalletAuth(), { wrapper });

    // First, connect to simulate a connected state
    act(() => {
      result.current.connectWithSiwe(jest.fn(), '0x1234');
    });

    await waitFor(() => expect(result.current.isConnected).toBe(true));

    // Then, disconnect
    act(() => {
      result.current.disconnect();
    });

    await waitFor(() => expect(result.current.isConnected).toBe(false));
  });
});
