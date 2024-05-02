import { adminSdk } from '@gql/admin/api';
import { getCurrentUser } from '@next/next-auth/user';
import { Payment } from '@payment/admin';
import { cancelPurchaseForUser } from './action';

jest.mock('@next/next-auth/user', () => ({
  getCurrentUser: jest.fn(),
}));

jest.mock('@gql/admin/api', () => ({
  adminSdk: {
    GetStripeCustomerByAccount: jest.fn(),
    GetStripeCheckoutSessionForUser: jest.fn(),
  },
}));

jest.mock('@payment/admin', () => ({
  Payment: jest.fn(() => ({
    expireStripeCheckoutSession: jest.fn(),
  })),
}));

describe('cancelPurchaseForUser', () => {
  // Setup for Payment mock
  let expireStripeCheckoutSessionMock: jest.Mock;

  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();

    // Setup mock for expireStripeCheckoutSession method
    expireStripeCheckoutSessionMock = jest.fn();
    Payment.mockImplementation(() => ({
      expireStripeCheckoutSession: expireStripeCheckoutSessionMock,
    }));
  });

  it('should cancel purchase for existing user', async () => {
    // Mock user and Stripe data
    const mockUser = { id: 'user123' };
    const mockStripeCustomerId = 'cus_123456789';
    const mockStripeSessionId = 'sess_123456789';

    getCurrentUser.mockResolvedValue(mockUser);
    adminSdk.GetStripeCustomerByAccount.mockResolvedValue({
      stripeCustomer: [{ stripeCustomerId: mockStripeCustomerId }],
    });
    adminSdk.GetStripeCheckoutSessionForUser.mockResolvedValue({
      stripeCheckoutSession: [{ stripeSessionId: mockStripeSessionId }],
    });

    await cancelPurchaseForUser();

    expect(getCurrentUser).toHaveBeenCalled();
    expect(adminSdk.GetStripeCustomerByAccount).toHaveBeenCalledWith({
      accountId: mockUser.id,
    });
    expect(adminSdk.GetStripeCheckoutSessionForUser).toHaveBeenCalledWith({
      stripeCustomerId: mockStripeCustomerId,
    });
    expect(expireStripeCheckoutSessionMock).toHaveBeenCalledWith({
      stripeCheckoutSessionId: mockStripeSessionId,
    });
  });

  it('should throw an error if user is undefined', async () => {
    getCurrentUser.mockResolvedValue(undefined);

    await expect(cancelPurchaseForUser()).rejects.toThrow(
      'Error : user is undefined',
    );

    expect(getCurrentUser).toHaveBeenCalled();
  });
});
