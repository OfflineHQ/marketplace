import { useIframeConnect } from '@next/iframe';
import { useWalletAuth } from '@next/wallet';
import { act, renderHook } from '@testing-library/react';
import { useConnectWallet } from './useConnectWallet';
import { useShopifyCustomer } from './useShopifyCustomer';

jest.mock('next/navigation');
jest.mock('@next/wallet');
jest.mock('@tanstack/react-query', () => ({
  useMutation: jest.fn().mockImplementation((options) => ({
    mutate: jest.fn().mockImplementation(async (props) => {
      try {
        const result = await options.mutationFn(props);
        options.onSuccess(result, props);
      } catch (error) {
        options.onError(error);
      }
    }),
    ...options,
  })),
}));
jest.mock('@next/iframe', () => ({
  useIframeConnect: jest.fn(),
}));
jest.mock('./useShopifyCustomer', () => ({
  useShopifyCustomer: jest.fn(),
}));

describe('useConnectWallet', () => {
  const mockRouter = { replace: jest.fn() };
  const mockPathname = '/test';
  const mockSearchParams = new URLSearchParams('param1=value1');
  const mockConnect = jest.fn();
  const mockSignWithEthereum = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useWalletAuth as jest.Mock).mockReturnValue({ connect: mockConnect });
    (useIframeConnect as jest.Mock).mockReturnValue({
      signWithEthereum: mockSignWithEthereum,
    });
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useConnectWallet());

    expect(result.current.accountNotMatching).toBe(false);
    expect(result.current.connectWalletMutation).toBeDefined();
    expect(result.current.connectToDappMutation).toBeDefined();
  });

  it('should call connect function with correct parameters', async () => {
    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectWalletMutation.mutate({
        walletAddress: '0x123',
        isCreatingAccount: true,
        walletToConnect: '0x456',
      });
    });

    expect(mockConnect).toHaveBeenCalledWith('0x123', true, '0x456');
  });

  it('should set accountNotMatching to true on specific error', async () => {
    mockConnect.mockRejectedValue(new Error('Wallet address does not match'));
    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectWalletMutation.mutate({
        walletAddress: '0x123',
        isCreatingAccount: false,
        walletToConnect: '0x456',
      });
    });

    expect(result.current.accountNotMatching).toBe(true);
  });

  it('should not set accountNotMatching to true on other errors', async () => {
    mockConnect.mockRejectedValue(new Error('Some other error'));
    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectWalletMutation.mutate({
        walletAddress: '0x123',
        isCreatingAccount: false,
        walletToConnect: '0x456',
      });
    });

    expect(result.current.accountNotMatching).toBe(false);
  });

  it('should provide a retryConnectToDapp function', () => {
    const { result } = renderHook(() => useConnectWallet());
    expect(result.current.retryConnectToDapp).toBeInstanceOf(Function);
  });

  it('should call signWithEthereum when wallet and customer id are available', async () => {
    (useWalletAuth as jest.Mock).mockReturnValue({
      wallet: '0x789',
      connect: mockConnect,
    });
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      // Trigger the useEffect
      result.current.connectToDappMutation.mutate('testCustomerId');
    });

    expect(mockSignWithEthereum).toHaveBeenCalledWith('testCustomerId');
  });

  it('should not call signWithEthereum when wallet is not available', () => {
    (useWalletAuth as jest.Mock).mockReturnValue({
      wallet: null,
      connect: mockConnect,
    });
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });

    renderHook(() => useConnectWallet());

    expect(mockSignWithEthereum).not.toHaveBeenCalled();
  });

  it('should not call signWithEthereum when customer id is not available', () => {
    (useWalletAuth as jest.Mock).mockReturnValue({
      wallet: '0x789',
      connect: mockConnect,
    });
    (useShopifyCustomer as jest.Mock).mockReturnValue({ customer: null });

    renderHook(() => useConnectWallet());

    expect(mockSignWithEthereum).not.toHaveBeenCalled();
  });

  it('should call signWithEthereum when retryConnectToDapp is called', async () => {
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      result.current.retryConnectToDapp();
    });

    expect(mockSignWithEthereum).toHaveBeenCalledWith('testCustomerId');
  });

  it('should log success message when connectToDappMutation succeeds', async () => {
    const consoleSpy = jest.spyOn(console, 'log');
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectToDappMutation.mutate('testCustomerId');
    });

    expect(consoleSpy).toHaveBeenCalledWith('Connected to dapp');
    consoleSpy.mockRestore();
  });

  it('should log error message when connectToDappMutation fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    mockSignWithEthereum.mockRejectedValue(new Error('Connection failed'));
    (useShopifyCustomer as jest.Mock).mockReturnValue({
      customer: { id: 'testCustomerId' },
    });

    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectToDappMutation.mutate('testCustomerId');
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error connecting to dapp:',
      expect.any(Error),
    );
    consoleErrorSpy.mockRestore();
  });
});
