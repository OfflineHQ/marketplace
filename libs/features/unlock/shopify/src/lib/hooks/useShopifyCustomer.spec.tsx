import { useGetShopifyCustomerQuery } from '@gql/anonymous/react-query';
import { useIframeOffKey } from '@next/iframe';
import { useWalletContext } from '@next/wallet';
import { renderHook } from '@testing-library/react';
import { ShopifyCustomerStatus } from '../types';
import { useShopifyCustomer } from './useShopifyCustomer';

jest.mock('@gql/anonymous/react-query');
jest.mock('@next/iframe');
jest.mock('@next/wallet');

describe('useShopifyCustomer', () => {
  const mockOrganizerId = 'test-organizer-id';
  const mockCustomer = { id: 'test-id' };

  beforeEach(() => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: mockCustomer,
    });
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [],
    });
  });

  it('returns correct status when iframe is not ready', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({ isReady: false });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toBeNull();
    expect(result.current.status).toBeNull();
  });

  it('returns correct status when customer is not connected', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: null,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toBeNull();
    expect(result.current.status).toBe(ShopifyCustomerStatus.NotConnected);
  });

  it('returns correct status when wallet matches', () => {
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: { shopifyCustomer: [{ id: 'test-id', address: '0x123' }] },
      isLoading: false,
      error: null,
    });
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: { id: 'test-id' },
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [{ address: '0x123' }],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual({ id: 'test-id' });
    expect(result.current.status).toBe(ShopifyCustomerStatus.MatchingWallet);
    expect(result.current.walletToConnect).toBe('0x123');
  });

  it('returns correct status when data is loading', () => {
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBeNull();
  });

  it('returns correct status when customer has no recorded wallet', () => {
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: { shopifyCustomer: [] },
      isLoading: false,
      error: null,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(ShopifyCustomerStatus.NewAccount);
  });

  it('returns correct status when customer has no recorded wallet but wallet in storage', () => {
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: { shopifyCustomer: [] },
      isLoading: false,
      error: null,
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [{ address: '0x123' }],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(
      ShopifyCustomerStatus.NoRecordedShopifyCustomer,
    );
  });

  it('returns correct status when wallet does not match', () => {
    (useGetShopifyCustomerQuery as jest.Mock).mockReturnValue({
      data: { shopifyCustomer: [{ address: '0x123' }] },
      isLoading: false,
      error: null,
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [{ address: '0x456' }],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(ShopifyCustomerStatus.NoMatchingWallet);
    expect(result.current.walletToConnect).toBeUndefined();
  });
});
