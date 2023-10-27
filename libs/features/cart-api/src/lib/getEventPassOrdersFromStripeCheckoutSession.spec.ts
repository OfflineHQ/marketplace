import { userSdk } from '@gql/user/api';
import { Payment } from '@payment/admin';
import { accounts } from '@test-utils/gql';
import {
  getEventPassOrdersFromStripeCheckoutSession,
  GetEventPassOrdersFromStripeCheckoutSessionProps,
} from './getEventPassOrdersFromStripeCheckoutSession';

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

describe('getEventPassOrdersFromStripeCheckoutSession', () => {
  let mockedPayment: jest.Mocked<Payment>;
  const props: GetEventPassOrdersFromStripeCheckoutSessionProps = {
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
    const mockEventPassOrders = [
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
    mockedUserSdk.GetEventPassOrdersFromIds = jest
      .fn()
      .mockResolvedValue({ eventPassOrder: mockEventPassOrders });

    const result = await getEventPassOrdersFromStripeCheckoutSession(
      props,
      mockedPayment,
    );

    expect(result).toEqual(mockEventPassOrders);
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
      getEventPassOrdersFromStripeCheckoutSession(props, mockedPayment),
    ).rejects.toThrow('Customer or Stripe Checkout session not found');
  });
});
