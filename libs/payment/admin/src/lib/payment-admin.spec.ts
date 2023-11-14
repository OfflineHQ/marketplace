import env from '@env/server';
import * as kycApi from '@features/kyc-api';
import { adminSdk } from '@gql/admin/api';
import {
  KycStatus_Enum,
  Locale,
  OrderStatus_Enum,
  StripeCheckoutSessionType_Enum,
} from '@gql/shared/types';
import { NftClaimable } from '@nft/thirdweb-admin';
import { StripeCustomer } from '@payment/types';
import { accounts } from '@test-utils/gql';
import { Payment } from './payment-admin';

jest.mock('@nft/thirdweb-admin');
jest.mock('@features/kyc-api');

describe('Payment', () => {
  let payment: Payment;
  let nftClaimableMock: jest.Mocked<NftClaimable>;

  beforeEach(() => {
    nftClaimableMock = new NftClaimable() as jest.Mocked<NftClaimable>;
    payment = new Payment();
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize Stripe and NftClaimable in constructor', () => {
    expect(payment.stripe).toBeDefined();
    expect(NftClaimable).toHaveBeenCalled();
  });

  describe('webhookStripeConstructEvent', () => {
    beforeEach(() => {
      payment.stripe = {
        webhooks: {
          constructEvent: jest.fn(),
        },
      } as any;
    });
    it('should call stripe.webhooks.constructEvent with correct parameters', () => {
      const body = 'body';
      const signature = 'signature';
      const secret = 'secret';
      payment.webhookStripeConstructEvent({ body, signature });
      expect(payment.stripe.webhooks.constructEvent).toHaveBeenCalledWith(
        body,
        signature,
        env.STRIPE_WEBHOOK_SECRET,
      );
    });

    it('should throw error when stripe.webhooks.constructEvent fails', () => {
      const body = 'body';
      const signature = 'signature';
      (
        payment.stripe.webhooks.constructEvent as jest.Mock
      ).mockImplementationOnce(() => {
        throw new Error('Stripe error');
      });
      expect(() =>
        payment.webhookStripeConstructEvent({ body, signature }),
      ).toThrow('Stripe error');
    });
  });
  describe('getStripeCustomer', () => {
    it('should call stripe.customers.retrieve with correct parameters', async () => {
      const stripeCustomerId = 'stripeCustomerId';
      payment.stripe.customers = {
        retrieve: jest.fn().mockResolvedValue({}),
      } as any;
      await payment.getStripeCustomer({ stripeCustomerId });
      expect(payment.stripe.customers.retrieve).toHaveBeenCalledWith(
        stripeCustomerId,
      );
    });

    it('should throw error when stripe.customers.retrieve fails', async () => {
      const stripeCustomerId = 'stripeCustomerId';
      payment.stripe.customers = {
        retrieve: jest.fn().mockRejectedValue(new Error('Stripe error')),
      } as any;
      await expect(
        payment.getStripeCustomer({ stripeCustomerId }),
      ).rejects.toThrow('Stripe error');
    });
  });
  describe('getOrCreateStripeCustomer', () => {
    it('should throw error when user kyc is missing', async () => {
      const user = { id: 'userId', address: 'address' };
      await expect(
        payment.getOrCreateStripeCustomer({ user: accounts.google_user }),
      ).rejects.toThrow(`Missing kyc for user: ${accounts.google_user.id}`);
    });

    it('should return existing stripe customer if it exists', async () => {
      const existingStripeCustomer = { stripeCustomer: [{}] };
      adminSdk.GetStripeCustomerByAccount = jest
        .fn()
        .mockResolvedValue(existingStripeCustomer);
      const result = await payment.getOrCreateStripeCustomer({
        user: accounts.alpha_user,
      });
      expect(result).toEqual(existingStripeCustomer.stripeCustomer[0]);
    });

    it('should create a new stripe customer and store it if it does not exist', async () => {
      const userPersonalData = {
        email: 'email',
        lang: 'en',
        phone: 'phone',
        id: 'dummy',
        applicantId: 'dummy',
        inspectionId: 'dummy',
        levelName: 'dummy',
        externalUserId: 'dummy',
        review: {
          reviewStatus: KycStatus_Enum.Completed,
          reprocessing: false,
          createDate: 'dummy',
        },
        createdAt: 'dummy',
      };
      const stripeCustomer = { id: 'stripeCustomerId' };
      const createdStripeCustomer = { insert_stripeCustomer_one: {} };

      adminSdk.GetStripeCustomerByAccount = jest.fn().mockResolvedValue(null);
      (kycApi.getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue(
        userPersonalData,
      );
      payment.stripe.customers = {
        create: jest.fn().mockResolvedValue(stripeCustomer),
      } as any;
      adminSdk.CreateStripeCustomer = jest
        .fn()
        .mockResolvedValue(createdStripeCustomer);

      const result = await payment.getOrCreateStripeCustomer({
        user: accounts.alpha_user,
      });

      expect(kycApi.getSumSubApplicantPersonalData).toHaveBeenCalledWith(
        accounts.alpha_user.kyc.applicantId,
      );
      expect(payment.stripe.customers.create).toHaveBeenCalledWith({
        email: userPersonalData.email,
        preferred_locales: [userPersonalData.lang],
        phone: userPersonalData.phone,
        metadata: {
          userId: accounts.alpha_user.id,
        },
      });
      expect(adminSdk.CreateStripeCustomer).toHaveBeenCalledWith({
        stripeCustomer: {
          stripeCustomerId: stripeCustomer.id,
          accountId: accounts.alpha_user.id,
        },
      });
      expect(result).toEqual(createdStripeCustomer.insert_stripeCustomer_one);
    });
  });
  describe('updateStripeCustomer', () => {
    it('should call stripe.customers.update with correct parameters', async () => {
      const stripeCustomerId = 'stripeCustomerId';
      payment.stripe.customers = {
        update: jest.fn().mockResolvedValue({}),
      } as any;
      await payment.updateStripeCustomer({
        stripeCustomerId,
        user: accounts.alpha_user,
      });
      expect(payment.stripe.customers.update).toHaveBeenCalledWith(
        stripeCustomerId,
        {
          email: accounts.alpha_user.email,
          metadata: {
            userId: accounts.alpha_user.id,
          },
        },
      );
    });

    it('should return the updated customer', async () => {
      const stripeCustomerId = 'stripeCustomerId';
      const updatedCustomer = { id: 'updatedCustomerId' };
      payment.stripe.customers = {
        update: jest.fn().mockResolvedValue(updatedCustomer),
      } as any;
      const result = await payment.updateStripeCustomer({
        stripeCustomerId,
        user: accounts.alpha_user,
      });
      expect(result).toEqual(updatedCustomer);
    });

    it('should throw error when stripe.customers.update fails', async () => {
      const stripeCustomerId = 'stripeCustomerId';
      payment.stripe.customers = {
        update: jest.fn().mockRejectedValue(new Error('Stripe error')),
      } as any;
      await expect(
        payment.updateStripeCustomer({
          stripeCustomerId,
          user: accounts.alpha_user,
        }),
      ).rejects.toThrow('Stripe error');
    });
  });
  describe('moveEventPassPendingOrdersToConfirmed', () => {
    it('should call adminSdk.MoveEventPassPendingOrdersToConfirmed with correct parameters', async () => {
      const eventPassPendingOrders = [
        {
          id: 'order1',
          eventPassId: 'eventPass1',
          quantity: 1,
          created_at: '2022-01-01T00:00:00Z',
          eventPass: {
            event: {
              slug: 'event1',
              organizer: {
                slug: 'organizer1',
              },
            },
          },
        },
        {
          id: 'order2',
          eventPassId: 'eventPass2',
          quantity: 2,
          created_at: '2022-01-01T00:00:00Z',
          eventPass: {
            event: {
              slug: 'event2',
              organizer: {
                slug: 'organizer2',
              },
            },
          },
        },
      ];
      const accountId = 'accountId';
      const locale = Locale.En;
      const returning = [{ id: 'order1' }, { id: 'order2' }];
      adminSdk.MoveEventPassPendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue({
          insert_eventPassOrder: { returning },
        });

      const result = await payment.moveEventPassPendingOrdersToConfirmed({
        eventPassPendingOrders,
        accountId,
        locale,
      });

      expect(
        adminSdk.MoveEventPassPendingOrdersToConfirmed,
      ).toHaveBeenCalledWith({
        eventPassPendingOrderIds: ['order1', 'order2'],
        objects: [
          {
            eventPassId: 'eventPass1',
            status: 'CONFIRMED',
            accountId,
            quantity: 1,
          },
          {
            eventPassId: 'eventPass2',
            status: 'CONFIRMED',
            accountId,
            quantity: 2,
          },
        ],
        locale,
        stage: env.HYGRAPH_STAGE,
      });
      expect(result).toEqual(returning);
    });

    it('should throw error when adminSdk.MoveEventPassPendingOrdersToConfirmed fails', async () => {
      const accountId = 'accountId';
      const locale = Locale.En;
      adminSdk.MoveEventPassPendingOrdersToConfirmed = jest
        .fn()
        .mockRejectedValue(new Error('SDK error'));

      await expect(
        payment.moveEventPassPendingOrdersToConfirmed({
          eventPassPendingOrders: [],
          accountId,
          locale,
        }),
      ).rejects.toThrow('SDK error');
    });
  });
  describe('markEventPassOrderAsCancelled', () => {
    it('should call adminSdk.UpdateEventPassOrdersStatus with correct parameters', async () => {
      const eventPassOrdersId = ['order1', 'order2'];
      adminSdk.UpdateEventPassOrdersStatus = jest.fn().mockReturnValue({});
      await payment.markEventPassOrderAsCancelled({ eventPassOrdersId });
      expect(adminSdk.UpdateEventPassOrdersStatus).toHaveBeenCalledWith({
        updates: eventPassOrdersId.map((id) => ({
          _set: {
            status: OrderStatus_Enum.Cancelled,
          },
          where: {
            id: {
              _eq: id,
            },
          },
        })),
      });
    });
  });

  describe('markEventPassOrderAsRefunded', () => {
    it('should call adminSdk.UpdateEventPassOrdersStatus with correct parameters', async () => {
      const eventPassOrdersId = ['order1', 'order2'];
      adminSdk.UpdateEventPassOrdersStatus = jest.fn().mockReturnValue({});
      await payment.markEventPassOrderAsRefunded({ eventPassOrdersId });
      expect(adminSdk.UpdateEventPassOrdersStatus).toHaveBeenCalledWith({
        updates: eventPassOrdersId.map((id) => ({
          _set: {
            status: OrderStatus_Enum.Refunded,
          },
          where: {
            id: {
              _eq: id,
            },
          },
        })),
      });
    });
  });
  describe('createStripeCheckoutSession', () => {
    const eventPassOrders = [
      {
        id: 'order1',
        eventPassPricing: {
          priceCurrency: 'usd',
          priceAmount: 100,
        },
      },
    ];
    beforeEach(() => {
      payment.stripe.checkout.sessions = {
        create: jest.fn().mockResolvedValue({}),
      } as any;
      adminSdk.SetEventPassOrdersStripeCheckoutSessionId = jest
        .fn()
        .mockResolvedValue({});
      adminSdk.CreateStripeCheckoutSession = jest.fn().mockResolvedValue({});
    });
    it('should throw error if user already has an active checkout session', async () => {
      const stripeCustomer = { id: 'stripeCustomerId', email: 'email' };
      const eventPassPendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [{}],
      });

      await expect(
        payment.createStripeCheckoutSession({
          user: accounts.alpha_user,
          stripeCustomer: stripeCustomer as StripeCustomer,
          eventPassPendingOrders,
          locale,
          currency,
        }),
      ).rejects.toThrow(
        `User: ${accounts.alpha_user.id} already has an active checkout session: undefined`,
      );
    });

    it('should call moveEventPassPendingOrdersToConfirmed with correct parameters', async () => {
      const stripeCustomer = { id: 'stripeCustomerId', email: 'email' };
      const eventPassPendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.moveEventPassPendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(eventPassOrders);

      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        eventPassPendingOrders,
        locale,
        currency,
      });

      expect(
        payment.moveEventPassPendingOrdersToConfirmed,
      ).toHaveBeenCalledWith({
        eventPassPendingOrders,
        accountId: accounts.alpha_user.id,
        locale,
      });
    });

    it('should call stripe.checkout.sessions.create with correct parameters', async () => {
      const stripeCustomer = {
        id: 'stripeCustomerId',
        email: 'stripeCustomerEmail',
      };
      const eventPassPendingOrders = [];

      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.moveEventPassPendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(eventPassOrders);
      payment.stripe.checkout.sessions.create = jest
        .fn()
        .mockResolvedValue({ id: 'sessionId' });

      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        eventPassPendingOrders,
        locale,
        currency,
      });

      expect(payment.stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          client_reference_id: accounts.alpha_user.id,
          customer: stripeCustomer.id,
          currency,
          locale,
          mode: 'payment',
        }),
      );
    });

    it('should call adminSdk.SetEventPassOrdersStripeCheckoutSessionId and adminSdk.CreateStripeCheckoutSession with correct parameters', async () => {
      const stripeCustomer = {
        id: 'stripeCustomerId',
        email: 'stripeCustomerEmail',
      };
      const eventPassPendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      const sessionId = 'sessionId';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.moveEventPassPendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(eventPassOrders);
      payment.stripe.checkout.sessions.create = jest
        .fn()
        .mockResolvedValue({ id: sessionId });
      adminSdk.SetEventPassOrdersStripeCheckoutSessionId = jest
        .fn()
        .mockResolvedValue({});
      adminSdk.CreateStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        eventPassPendingOrders,
        locale,
        currency,
      });

      expect(
        adminSdk.SetEventPassOrdersStripeCheckoutSessionId,
      ).toHaveBeenCalledWith({
        updates: eventPassOrders.map(({ id }) => ({
          _set: {
            stripeCheckoutSessionId: sessionId,
          },
          where: {
            id: {
              _eq: id,
            },
          },
        })),
      });
      expect(adminSdk.CreateStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSession: {
          stripeSessionId: sessionId,
          stripeCustomerId: stripeCustomer.id,
          type: StripeCheckoutSessionType_Enum.EventPassOrder,
        },
      });
    });
  });
  describe('expireStripeCheckoutSession', () => {
    it('should call stripe.checkout.sessions.expire, getEventPassOrdersFromStripeCheckoutSession, markEventPassOrderAsCancelled, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [{ id: 'order1' }, { id: 'order2' }];
      payment.stripe.checkout.sessions.expire = jest.fn().mockResolvedValue({});
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markEventPassOrderAsCancelled = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.expireStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(payment.stripe.checkout.sessions.expire).toHaveBeenCalledWith(
        stripeCheckoutSessionId,
      );
      expect(
        payment.getEventPassOrdersFromStripeCheckoutSession,
      ).toHaveBeenCalledWith({ stripeCheckoutSessionId });
      expect(payment.markEventPassOrderAsCancelled).toHaveBeenCalledWith({
        eventPassOrdersId: orders.map((order) => order.id),
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
  });
  describe('getEventPassOrdersFromStripeCheckoutSession', () => {
    it('should call adminSdk.GetEventPassOrdersFromStripeCheckoutSession with correct parameters and return the result', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const eventPassOrder = [{ id: 'order1' }, { id: 'order2' }];
      adminSdk.GetEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue({ eventPassOrder });

      const result = await payment.getEventPassOrdersFromStripeCheckoutSession({
        stripeCheckoutSessionId,
      });

      expect(
        adminSdk.GetEventPassOrdersFromStripeCheckoutSession,
      ).toHaveBeenCalledWith({ stripeCheckoutSessionId });
      expect(result).toEqual(eventPassOrder);
    });
  });
  describe('getStripeActiveCheckoutSessionForUser', () => {
    it('should call adminSdk.GetStripeCheckoutSessionForUser with correct parameters and return null if no active session', async () => {
      const stripeCustomerId = 'customerId';
      adminSdk.GetStripeCheckoutSessionForUser = jest
        .fn()
        .mockResolvedValue({ stripeCheckoutSession: [] });

      const result = await payment.getStripeActiveCheckoutSessionForUser({
        stripeCustomerId,
      });

      expect(adminSdk.GetStripeCheckoutSessionForUser).toHaveBeenCalledWith({
        stripeCustomerId,
      });
      expect(result).toBeNull();
    });

    it('should call adminSdk.GetStripeCheckoutSessionForUser and stripe.checkout.sessions.retrieve with correct parameters and return the result', async () => {
      const stripeCustomerId = 'customerId';
      const stripeSessionId = 'sessionId';
      adminSdk.GetStripeCheckoutSessionForUser = jest
        .fn()
        .mockResolvedValue({ stripeCheckoutSession: [{ stripeSessionId }] });
      payment.stripe.checkout.sessions.retrieve = jest
        .fn()
        .mockResolvedValue({ id: stripeSessionId });

      const result = await payment.getStripeActiveCheckoutSessionForUser({
        stripeCustomerId,
      });

      expect(adminSdk.GetStripeCheckoutSessionForUser).toHaveBeenCalledWith({
        stripeCustomerId,
      });
      expect(payment.stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
        stripeSessionId,
      );
      expect(result).toEqual({ id: stripeSessionId });
    });
  });
  describe('canceledStripeCheckoutSession', () => {
    it('should call getEventPassOrdersFromStripeCheckoutSession, markEventPassOrderAsCancelled, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [{ id: 'order1' }, { id: 'order2' }];
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markEventPassOrderAsCancelled = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.canceledStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(
        payment.getEventPassOrdersFromStripeCheckoutSession,
      ).toHaveBeenCalledWith({ stripeCheckoutSessionId });
      expect(payment.markEventPassOrderAsCancelled).toHaveBeenCalledWith({
        eventPassOrdersId: orders.map((order) => order.id),
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
  });
  describe('confirmedStripeCheckoutSession', () => {
    it('should call getEventPassOrdersFromStripeCheckoutSession, nftClaimable.claimAllMetadatas, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [{ id: 'order1' }, { id: 'order2' }];
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.confirmedStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(
        payment.getEventPassOrdersFromStripeCheckoutSession,
      ).toHaveBeenCalledWith({ stripeCheckoutSessionId });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
    it('should throw an error when getEventPassOrdersFromStripeCheckoutSession fails', async () => {
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockRejectedValue(new Error('Failed to get orders'));
      adminSdk.DeleteStripeCheckoutSession = jest.fn();
      await expect(
        payment.confirmedStripeCheckoutSession({
          stripeCheckoutSessionId: 'test',
        }),
      ).rejects.toThrow('Failed to get orders');
      expect(adminSdk.DeleteStripeCheckoutSession).not.toHaveBeenCalled();
    });

    it('should throw an error when checkOrder fails for one of the orders', async () => {
      const orders = [{ id: 'order1' }, { id: 'order2' }];
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue([orders]);
      adminSdk.DeleteStripeCheckoutSession = jest.fn();

      await expect(
        payment.confirmedStripeCheckoutSession({
          stripeCheckoutSessionId: 'test',
        }),
      ).rejects.toThrow('Error claiming NFTs: Failed to claim NFTs');
      expect(adminSdk.DeleteStripeCheckoutSession).not.toHaveBeenCalled();
    });
  });
  describe('refundPayment', () => {
    it('should call stripe.refunds.create, getEventPassOrdersFromStripeCheckoutSession, markEventPassOrderAsRefunded, and adminSdk.DeleteStripeCheckoutSession with correct parameters and return the refund', async () => {
      const paymentIntentId = 'paymentIntentId';
      const checkoutSessionId = 'checkoutSessionId';
      const refund = { status: 'succeeded' };
      const orders = [{ id: 'order1' }, { id: 'order2' }];
      payment.stripe.refunds.create = jest.fn().mockResolvedValue(refund);
      payment.getEventPassOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markEventPassOrderAsRefunded = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      const result = await payment.refundPayment({
        paymentIntentId,
        checkoutSessionId,
      });

      expect(payment.stripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId,
      });
      expect(
        payment.getEventPassOrdersFromStripeCheckoutSession,
      ).toHaveBeenCalledWith({ stripeCheckoutSessionId: checkoutSessionId });
      expect(payment.markEventPassOrderAsRefunded).toHaveBeenCalledWith({
        eventPassOrdersId: orders.map((order) => order.id),
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: checkoutSessionId,
      });
      expect(result).toEqual(refund);
    });

    it('should throw error if refund status is not succeeded or pending', async () => {
      const paymentIntentId = 'paymentIntentId';
      const checkoutSessionId = 'checkoutSessionId';
      const refund = { status: 'failed' };
      payment.stripe.refunds.create = jest.fn().mockResolvedValue(refund);

      await expect(
        payment.refundPayment({ paymentIntentId, checkoutSessionId }),
      ).rejects.toThrow(
        `Refund failed for paymentIntentId: ${paymentIntentId} with status: ${refund.status}`,
      );
    });
  });
});
