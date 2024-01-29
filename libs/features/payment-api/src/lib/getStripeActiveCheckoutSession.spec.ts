import * as userModule from '@next/next-auth/user';
import { getStripeActiveCheckoutSession } from './getStripeActiveCheckoutSession';

// Mock '@payment/admin' at the module level
jest.mock('@payment/admin', () => ({
  Payment: jest.fn().mockImplementation(() => ({
    getOrCreateStripeCustomer: jest.fn().mockResolvedValue({
      stripeCustomerId: 'cus_test123',
    }),
    getStripeActiveCheckoutSessionForUser: jest
      .fn()
      .mockResolvedValue('session_test123'),
  })),
}));

// Mock '@next/next-auth/user' at the module level
jest.mock('@next/next-auth/user');

describe('getStripeActiveCheckoutSession', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Reset the default mock behavior for getCurrentUser
    userModule.getCurrentUser.mockResolvedValue({ email: 'test@example.com' });
  });

  it('throws an error if no user is found', async () => {
    userModule.getCurrentUser.mockResolvedValue(null);

    await expect(getStripeActiveCheckoutSession()).rejects.toThrow(
      'User not found',
    );
  });

  it('throws an error if the user has no email', async () => {
    userModule.getCurrentUser.mockResolvedValue({ email: undefined });

    await expect(getStripeActiveCheckoutSession()).rejects.toThrow(
      'User has no email',
    );
  });

  it('throws an error if the user email is "undefined"', async () => {
    userModule.getCurrentUser.mockResolvedValue({ email: 'undefined' });

    await expect(getStripeActiveCheckoutSession()).rejects.toThrow(
      'User has no email',
    );
  });

  it('returns a session id for a valid user', async () => {
    // The default mock behavior is already set to a valid user in beforeEach
    const sessionId = await getStripeActiveCheckoutSession();
    expect(sessionId).toEqual('session_test123');
  });
});
