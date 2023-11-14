import { Payment } from '@payment/admin';
import { StripeCheckoutSessionEnum } from '@payment/types';
import { stripeCheckoutStatus } from '../lib/payment-webhooks';

// Mock the Payment class and its methods
jest.mock('@payment/admin', () => {
  return {
    Payment: jest.fn().mockImplementation(() => {
      return {
        webhookStripeConstructEvent: jest.fn(),
        canceledStripeCheckoutSession: jest.fn(),
        confirmedStripeCheckoutSession: jest.fn(),
        refundPayment: jest.fn(),
      };
    }),
  };
});

// Create a new instance of the mocked Payment class
const mockPayment = new Payment();

// Create a mock Headers object
const mockHeaders: Headers = {
  get: jest.fn().mockReturnValue('Stripe-Signature'),
} as unknown as Headers;

// Mock the headers function to return the mock Headers object
jest.mock('next/headers', () => ({
  headers: () => mockHeaders,
}));

const mockRequest: Request = {
  text: jest.fn().mockReturnValue('body'),
} as unknown as Request;

describe('stripeCheckoutStatus', () => {
  beforeEach(() => {
    mockPayment.webhookStripeConstructEvent = jest.fn().mockReturnValue({
      type: StripeCheckoutSessionEnum.completed,
      data: {
        object: {
          mode: 'payment',
          payment_status: 'paid',
          id: 'checkoutSessionId',
        },
      },
    });
    mockPayment.canceledStripeCheckoutSession = jest.fn();
    mockPayment.confirmedStripeCheckoutSession = jest.fn();
    mockPayment.refundPayment = jest.fn();
  });

  it('should handle complete event successfully', async () => {
    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.webhookStripeConstructEvent).toHaveBeenCalledWith({
      body: 'body',
      signature: 'Stripe-Signature',
    });
    expect(mockPayment.confirmedStripeCheckoutSession).toHaveBeenCalledWith({
      stripeCheckoutSessionId: 'checkoutSessionId',
    });
    expect(result.status).toEqual(200);
  });

  it('should handle expired event successfully', async () => {
    mockPayment.webhookStripeConstructEvent = jest.fn().mockReturnValue({
      type: StripeCheckoutSessionEnum.expired,
      data: {
        object: {
          mode: 'payment',
          id: 'checkoutSessionId',
        },
      },
    });

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.canceledStripeCheckoutSession).toHaveBeenCalledWith({
      stripeCheckoutSessionId: 'checkoutSessionId',
    });
    expect(result.status).toEqual(200);
  });

  it('should handle error when constructing event', async () => {
    mockPayment.webhookStripeConstructEvent = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error constructing event');
      });

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);
    expect(result.status).toEqual(400);
  });

  it('Unhandled error when confirming checkout session', async () => {
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error confirming checkout session');
      });
    mockPayment.refundPayment = jest.fn();
    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.refundPayment).not.toHaveBeenCalled();
    expect(result.status).toEqual(500);
  });

  it('Should handle error confirming checkout session failed because `Error claiming NFTs` and no payment_intent is on checkout session for refund', async () => {
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error claiming NFTs: test');
      });

    mockPayment.refundPayment = jest.fn();

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.refundPayment).not.toHaveBeenCalled();
    expect(result.status).toEqual(500);
  });

  it('Should handle error and refund when confirming checkout session because `Error claiming NFTs`', async () => {
    mockPayment.webhookStripeConstructEvent = jest.fn().mockReturnValue({
      type: StripeCheckoutSessionEnum.completed,
      data: {
        object: {
          mode: 'payment',
          payment_status: 'paid',
          id: 'checkoutSessionId',
          payment_intent: {
            id: 'paymentIntentId',
          },
        },
      },
    });
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Some orders failed for an amount of : 82500');
      });
    mockPayment.refundPartialPayment = jest.fn();

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.refundPartialPayment).toHaveBeenCalledWith({
      paymentIntentId: 'paymentIntentId',
      amount: 82500,
    });
    expect(result.status).toEqual(200);
  });

  it('Should handle error when refund fails', async () => {
    mockPayment.webhookStripeConstructEvent = jest.fn().mockReturnValue({
      type: StripeCheckoutSessionEnum.completed,
      data: {
        object: {
          mode: 'payment',
          payment_status: 'paid',
          id: 'checkoutSessionId',
          payment_intent: {
            id: 'paymentIntentId',
          },
        },
      },
    });
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Some orders failed for an amount of : 8250');
      });

    mockPayment.refundPartialPayment = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error refunding payment');
    });

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);

    expect(mockPayment.refundPartialPayment).toHaveBeenCalledWith({
      paymentIntentId: 'paymentIntentId',
      amount: 8250,
    });
    expect(result.status).toEqual(200); // Adjust this based on how your function handles refund errors
  });

  it('should handle error when canceling checkout session', async () => {
    mockPayment.webhookStripeConstructEvent = jest.fn().mockReturnValue({
      type: StripeCheckoutSessionEnum.expired,
      data: {
        object: {
          mode: 'payment',
          id: 'checkoutSessionId',
        },
      },
    });
    mockPayment.canceledStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error canceling checkout session');
      });

    const result = await stripeCheckoutStatus(mockRequest, mockPayment);
    expect(result.status).toEqual(400);
  });
});
