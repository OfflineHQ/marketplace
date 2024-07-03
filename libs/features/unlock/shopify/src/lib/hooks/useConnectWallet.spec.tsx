import { useWalletAuth } from '@next/wallet';
import { act, renderHook } from '@testing-library/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useConnectWallet } from './useConnectWallet';

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

describe('useConnectWallet', () => {
  const mockRouter = { replace: jest.fn() };
  const mockPathname = '/test';
  const mockSearchParams = new URLSearchParams('param1=value1');
  const mockConnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue(mockPathname);
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useWalletAuth as jest.Mock).mockReturnValue({ connect: mockConnect });
  });

  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useConnectWallet());

    expect(result.current.accountNotMatching).toBe(false);
    expect(result.current.connectWalletMutation).toBeDefined();
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

  it('should update URL on successful connection', async () => {
    mockConnect.mockResolvedValue('0x789');
    const { result } = renderHook(() => useConnectWallet());

    await act(async () => {
      await result.current.connectWalletMutation.mutate({
        walletAddress: '0x123',
        isCreatingAccount: false,
        walletToConnect: '0x456',
      });
    });

    expect(mockRouter.replace).toHaveBeenCalledWith(
      '/test/0x789?param1=value1',
    );
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
});
