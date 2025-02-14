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

const mockPayload = 'body';
const mockSignature = 'Stripe-Signature';

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
    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

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

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

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

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(result.status).toEqual(400);
  });

  it('Unhandled error when confirming checkout session', async () => {
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error confirming checkout session');
      });
    mockPayment.refundPayment = jest.fn();
    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(mockPayment.refundPayment).not.toHaveBeenCalled();
    expect(result.status).toEqual(500);
  });

  it('Should handle error confirming checkout session failed because `Error processing orders` and no payment_intent is on checkout session for refund', async () => {
    mockPayment.confirmedStripeCheckoutSession = jest
      .fn()
      .mockImplementation(() => {
        throw new Error('Error processing orders: test');
      });

    mockPayment.refundPayment = jest.fn();

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(mockPayment.refundPayment).not.toHaveBeenCalled();
    expect(result.status).toEqual(500);
  });

  it('Should handle error and refund when confirming checkout session because `Error processing orders`', async () => {
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
        throw new Error('Error processing orders : Fail');
      });
    mockPayment.refundPayment = jest.fn();

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(mockPayment.refundPayment).toHaveBeenCalledWith({
      paymentIntentId: 'paymentIntentId',
      checkoutSessionId: 'checkoutSessionId',
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
        throw new Error('Error processing orders : Fail');
      });

    mockPayment.refundPayment = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error refunding payment');
    });

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(mockPayment.refundPayment).toHaveBeenCalledWith({
      paymentIntentId: 'paymentIntentId',
      checkoutSessionId: 'checkoutSessionId',
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

    const result = await stripeCheckoutStatus(
      mockPayment,
      mockSignature,
      mockPayload,
    );

    expect(result.status).toEqual(400);
  });

  it('Should call refundPayment when confirming checkout session throws an error', async () => {
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
        throw new Error('Error processing orders: test');
      });
    mockPayment.refundPayment = jest.fn();

    await stripeCheckoutStatus(mockPayment, mockSignature, mockPayload);

    expect(mockPayment.refundPayment).toHaveBeenCalledWith({
      paymentIntentId: 'paymentIntentId',
      checkoutSessionId: 'checkoutSessionId',
    });
  });

  it('Should not call refundPayment when confirming checkout session throws an error for something other than an NFT claim', async () => {
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
        throw new Error('Hasura cloud engine error');
      });
    mockPayment.refundPayment = jest.fn();

    await stripeCheckoutStatus(mockPayment, mockSignature, mockPayload);

    expect(mockPayment.refundPayment).not.toHaveBeenCalledWith();
  });
});
