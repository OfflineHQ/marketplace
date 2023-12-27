import { userSdk } from '@gql/user/api';
import { Payment } from '@payment/admin';
import { accounts } from '@test-utils/gql';
import {
  getOrdersFromStripeCheckoutSession,
  GetOrdersFromStripeCheckoutSessionProps,
} from './getOrdersFromStripeCheckoutSession';

// Mock the Payment and userSdk classes
jest.mock('@payment/admin', () => {
  return {
    Payment: jest.fn().mockImplementation(() => {
      return {
        getStripeCheckoutSession: jest.fn(),
        getOrCreateStripeCustomer: jest.fn(),
        getStripeCustomerId: jest
          .fn()
          .mockImplementation((customer) => customer),
      };
    }),
  };
});
jest.mock('@gql/user/api');

const mockedUserSdk = userSdk;

describe('getOrdersFromStripeCheckoutSession', () => {
  let mockedPayment: jest.Mocked<Payment>;
  const props: GetOrdersFromStripeCheckoutSessionProps = {
    stripeCheckoutSessionId: 'test-session-id',
    user: accounts.alpha_user,
  };

  beforeEach(() => {
    // Create a new instance of the mocked Payment class for each test
    mockedPayment = new Payment() as jest.Mocked<Payment>;

    // Reset all mock implementations before each test
    jest.clearAllMocks();
  });

  it('should return event pass orders if customer id matches', async () => {
    const mockSession = {
      customer: 'test-customer-id',
      metadata: { eventPassOrderIds: '1,2,3' },
    };
    const mockCustomer = { stripeCustomerId: 'test-customer-id' };
    const mockOrders = [
      {
        id: '1',
        eventPassId: '1',
      },
    ];

    mockedPayment.getStripeCheckoutSession = jest
      .fn()
      .mockResolvedValue(mockSession);
    mockedPayment.getOrCreateStripeCustomer = jest
      .fn()
      .mockResolvedValue(mockCustomer);
    mockedUserSdk.GetOrdersFromIds = jest
      .fn()
      .mockResolvedValue({ eventPassOrder: mockOrders });

    const result = await getOrdersFromStripeCheckoutSession(
      props,
      mockedPayment,
    );

    expect(result).toEqual(mockOrders);
  });

  it('should throw an error if customer id does not match', async () => {
    const mockSession = {
      customer: 'test-customer-id',
      metadata: { eventPassOrderIds: '1,2,3' },
    };
    const mockCustomer = { stripeCustomerId: 'different-customer-id' };

    mockedPayment.getStripeCheckoutSession = jest
      .fn()
      .mockResolvedValue(mockSession);
    mockedPayment.getOrCreateStripeCustomer = jest
      .fn()
      .mockResolvedValue(mockCustomer);

    await expect(
      getOrdersFromStripeCheckoutSession(props, mockedPayment),
    ).rejects.toThrow('Customer or Stripe Checkout session not found');
  });
});
