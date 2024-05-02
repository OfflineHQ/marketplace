import { useIframeOffKey } from '@next/iframe';
import { useWalletContext } from '@next/wallet';
import { renderHook } from '@testing-library/react';
import { ShopifyCustomerStatus } from '../types';
import { useShopifyCustomer } from './useShopifyCustomer';

jest.mock('@next/iframe');
jest.mock('@next/wallet');

describe('useShopifyCustomer', () => {
  const mockOrganizerId = 'test-organizer-id';
  const mockCustomer = { id: 'test-id' };
  const mockLinkedCustomer = {
    address: '0x1234567890123456789012345678901234567890',
  };

  beforeEach(() => {
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
      linkedCustomer: null,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toBeNull();
    expect(result.current.status).toBe(ShopifyCustomerStatus.NotConnected);
  });

  it('returns correct status when wallet matches', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: mockCustomer,
      linkedCustomer: mockLinkedCustomer,
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [{ address: mockLinkedCustomer.address }],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(ShopifyCustomerStatus.MatchingAccount);
    expect(result.current.walletToConnect).toBe(mockLinkedCustomer.address);
  });

  it('returns correct status when data for linked customer is loading', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: mockCustomer,
      linkedCustomer: null,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBeNull();
  });

  it('returns correct status when customer has no recorded wallet', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: mockCustomer,
      linkedCustomer: {
        address: null,
      },
    });
    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(ShopifyCustomerStatus.NewAccount);
  });

  it('returns correct status when customer has no recorded wallet but wallet in storage', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: { id: 'test-id' },
      linkedCustomer: {
        address: null,
      },
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [
        { address: '0x1234567890123456789012345678901234567890' },
      ],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(
      ShopifyCustomerStatus.ExistingAccountNewCustomer,
    );
  });

  it('returns correct status when wallet does not match', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: { id: 'test-id' },
      linkedCustomer: {
        address: '0x1234567890123456789012345678901234567890',
      },
    });
    (useWalletContext as jest.Mock).mockReturnValue({
      walletInStorage: [
        { address: '0x0987654321098765432109876543210987654321' },
      ],
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );
    expect(result.current.customer).toEqual(mockCustomer);
    expect(result.current.status).toBe(ShopifyCustomerStatus.NoMatchingAccount);
    expect(result.current.walletToConnect).toBe(
      '0x1234567890123456789012345678901234567890',
    );
  });
  it('returns correct shopifyContext when customer is connected', () => {
    (useIframeOffKey as jest.Mock).mockReturnValue({
      isReady: true,
      customer: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
      },
      product: {
        title: 'Exclusive T-Shirt',
        available: true,
      },
      linkedCustomer: mockLinkedCustomer,
    });

    const { result } = renderHook(() =>
      useShopifyCustomer({ organizerId: mockOrganizerId }),
    );

    expect(result.current.shopifyContext).toEqual({
      customerFirstName: 'John',
      customerLastName: 'Doe',
      customerEmail: 'john.doe@example.com',
      productTitle: 'Exclusive T-Shirt',
      productAvailable: true,
    });
  });
});
