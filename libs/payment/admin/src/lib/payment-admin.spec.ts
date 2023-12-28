import { CurrencyRates } from '@currency/types';
import env from '@env/server';
import * as kycApi from '@features/kyc-api';
import { adminSdk } from '@gql/admin/api';
import {
  Currency_Enum,
  KycStatus_Enum,
  Locale,
  OrderStatus_Enum,
  StripeCheckoutSessionType_Enum,
} from '@gql/shared/types';
import { Posthog } from '@insight/server';
import { calculateUnitAmount } from '@next/currency-common';
import { NftClaimable } from '@nft/thirdweb-admin';
import { StripeCustomer } from '@payment/types';
import { accounts } from '@test-utils/gql';
import { Payment } from './payment-admin';

jest.mock('stripe');
jest.mock('@insight/server');
jest.mock('@nft/thirdweb-admin');
jest.mock('@features/kyc-api');
jest.mock('@gql/admin/api');
jest.mock('@next/currency-cache', () => {
  return {
    CurrencyCache: jest.fn().mockImplementation(() => {
      return {
        getRates: jest.fn().mockResolvedValue({
          EUR: { USD: 1.18, EUR: 1 },
          USD: { USD: 1, EUR: 0.85 },
        }),
      };
    }),
  };
});

describe('Payment', () => {
  const stripeCustomerId = 'stripeCustomerId';
  const stripeSessionId = 'sessionId';
  const createdStripeCustomer = {
    insert_stripeCustomer_one: {
      id: stripeCustomerId,
      accountId: accounts.alpha_user.id,
    },
  };
  let payment: Payment;
  let nftClaimableMock: jest.Mocked<NftClaimable>;

  beforeAll(() => {
    (Posthog.getInstance as jest.Mock).mockImplementation(() => ({
      getFeatureFlag: jest.fn().mockReturnValue(false),
    }));
  });

  beforeEach(() => {
    nftClaimableMock = new NftClaimable() as jest.Mocked<NftClaimable>;
    payment = new Payment();
    payment.stripe.checkout = {
      sessions: {
        create: jest.fn().mockResolvedValue({}),
        expire: jest.fn().mockResolvedValue({}),
        retrieve: jest.fn().mockResolvedValue({}),
      },
    } as any;
    payment.stripe.refunds = {
      create: jest.fn().mockResolvedValue({}),
    } as any;
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
      payment.stripe.webhooks = {
        constructEvent: jest.fn(),
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
      payment.stripe.customers = {
        retrieve: jest.fn().mockResolvedValue({}),
      } as any;
      await payment.getStripeCustomer({ stripeCustomerId });
      expect(payment.stripe.customers.retrieve).toHaveBeenCalledWith(
        stripeCustomerId,
      );
    });

    it('should throw error when stripe.customers.retrieve fails', async () => {
      payment.stripe.customers = {
        retrieve: jest.fn().mockRejectedValue(new Error('Stripe error')),
      } as any;
      await expect(
        payment.getStripeCustomer({ stripeCustomerId }),
      ).rejects.toThrow('Stripe error');
    });
  });
  describe('getOrCreateStripeCustomer', () => {
    it("shouldn't throw error when user kyc is missing and kycFlag activated", async () => {
      const stripeCustomer = { id: 'stripeCustomerId' };
      payment.stripe.customers = {
        create: jest.fn().mockResolvedValue(stripeCustomer),
      } as any;
      adminSdk.CreateStripeCustomer = jest
        .fn()
        .mockResolvedValue(createdStripeCustomer);

      const res = await payment.getOrCreateStripeCustomer({
        user: accounts.google_user,
      });
      expect(res).toBe(createdStripeCustomer.insert_stripeCustomer_one);
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

    it('should throw error when user kyc is missing and kycFlag activated', async () => {
      (Posthog.getInstance as jest.Mock).mockImplementationOnce(() => ({
        getFeatureFlag: jest.fn().mockReturnValue(true),
      }));
      await expect(
        payment.getOrCreateStripeCustomer({ user: accounts.google_user }),
      ).rejects.toThrow(`Missing kyc for user: ${accounts.google_user.id}`);
    });

    it('should create a new stripe customer and store it if it does not exist if kycFlag not activated', async () => {
      const stripeCustomer = { id: 'stripeCustomerId' };
      payment.stripe.customers = {
        create: jest.fn().mockResolvedValue(stripeCustomer),
      } as any;
      adminSdk.GetStripeCustomerByAccount = jest.fn().mockResolvedValue(null);
      adminSdk.CreateStripeCustomer = jest
        .fn()
        .mockResolvedValue(createdStripeCustomer);

      const result = await payment.getOrCreateStripeCustomer({
        user: accounts.alpha_user,
      });

      expect(payment.stripe.customers.create).toHaveBeenCalledWith({
        email: accounts.alpha_user.email,
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

    it('should create a new stripe customer and store it if it does not exist while retrieving getSumSubApplicantPersonalData if kycFlag activated', async () => {
      (Posthog.getInstance as jest.Mock).mockImplementationOnce(() => ({
        getFeatureFlag: jest.fn().mockReturnValue(true),
      }));
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
  describe('movePendingOrdersToConfirmed', () => {
    it('should call adminSdk.MovePendingOrdersToConfirmed with correct parameters', async () => {
      const pendingOrders = [
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
      adminSdk.MovePendingOrdersToConfirmed = jest.fn().mockResolvedValue({
        insert_order: { returning },
      });

      const result = await payment.movePendingOrdersToConfirmed({
        pendingOrders,
        accountId,
        locale,
      });

      expect(adminSdk.MovePendingOrdersToConfirmed).toHaveBeenCalledWith({
        pendingOrderIds: ['order1', 'order2'],
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

    it('should throw error when adminSdk.MovePendingOrdersToConfirmed fails', async () => {
      const accountId = 'accountId';
      const locale = Locale.En;
      adminSdk.MovePendingOrdersToConfirmed = jest
        .fn()
        .mockRejectedValue(new Error('SDK error'));

      await expect(
        payment.movePendingOrdersToConfirmed({
          pendingOrders: [],
          accountId,
          locale,
        }),
      ).rejects.toThrow('SDK error');
    });
  });
  describe('markOrderAsCancelled', () => {
    it('should call adminSdk.UpdateOrdersStatus with correct parameters', async () => {
      const ordersId = ['order1', 'order2'];
      adminSdk.UpdateOrdersStatus = jest.fn().mockReturnValue({});
      await payment.markOrderAsCancelled({ ordersId });
      expect(adminSdk.UpdateOrdersStatus).toHaveBeenCalledWith({
        updates: ordersId.map((id) => ({
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

  describe('markOrderAsRefunded', () => {
    it('should call adminSdk.UpdateOrdersStatus with correct parameters', async () => {
      const ordersId = ['order1', 'order2'];
      adminSdk.UpdateOrdersStatus = jest.fn().mockReturnValue({});
      await payment.markOrderAsRefunded({ ordersId });
      expect(adminSdk.UpdateOrdersStatus).toHaveBeenCalledWith({
        updates: ordersId.map((id) => ({
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
    const orders = [
      {
        id: 'order1',
        passPricing: {
          currency: Currency_Enum.Usd,
          amount: 100,
        },
      },
    ];
    beforeEach(() => {
      adminSdk.SetOrdersStripeCheckoutSessionId = jest
        .fn()
        .mockResolvedValue({});
      adminSdk.CreateStripeCheckoutSession = jest.fn().mockResolvedValue({});
    });
    it('should throw error if user already has an active checkout session', async () => {
      const stripeCustomer = { id: 'stripeCustomerId', email: 'email' };
      const pendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [{}],
      });

      await expect(
        payment.createStripeCheckoutSession({
          user: accounts.alpha_user,
          stripeCustomer: stripeCustomer as StripeCustomer,
          pendingOrders,
          locale,
          currency,
        }),
      ).rejects.toThrow(
        `User: ${accounts.alpha_user.id} already has an active checkout session: undefined`,
      );
    });

    it('should call movePendingOrdersToConfirmed with correct parameters', async () => {
      const stripeCustomer = { id: 'stripeCustomerId', email: 'email' };
      const pendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.movePendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(orders);
      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        pendingOrders,
        locale,
        currency,
      });

      expect(payment.movePendingOrdersToConfirmed).toHaveBeenCalledWith({
        pendingOrders,
        accountId: accounts.alpha_user.id,
        locale,
      });
    });

    it('should call stripe.checkout.sessions.create with correct parameters', async () => {
      const stripeCustomer = {
        id: 'stripeCustomerId',
        email: 'stripeCustomerEmail',
      };
      const pendingOrders = [];

      const locale = Locale.En;
      const currency = 'usd';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.movePendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(orders);
      payment.stripe.checkout.sessions.create = jest
        .fn()
        .mockResolvedValue({ id: 'sessionId' });

      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        pendingOrders,
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

    it('should call adminSdk.SetOrdersStripeCheckoutSessionId and adminSdk.CreateStripeCheckoutSession with correct parameters', async () => {
      const stripeCustomer = {
        id: 'stripeCustomerId',
        email: 'stripeCustomerEmail',
      };
      const pendingOrders = [];
      const locale = Locale.En;
      const currency = 'usd';
      const sessionId = 'sessionId';
      adminSdk.GetStripeCheckoutSessionForUser = jest.fn().mockResolvedValue({
        stripeCheckoutSession: [],
      });
      payment.movePendingOrdersToConfirmed = jest
        .fn()
        .mockResolvedValue(orders);
      payment.stripe.checkout.sessions.create = jest
        .fn()
        .mockResolvedValue({ id: sessionId });
      adminSdk.SetOrdersStripeCheckoutSessionId = jest
        .fn()
        .mockResolvedValue({});
      adminSdk.CreateStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.createStripeCheckoutSession({
        user: accounts.alpha_user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        pendingOrders,
        locale,
        currency,
      });

      expect(adminSdk.SetOrdersStripeCheckoutSessionId).toHaveBeenCalledWith({
        updates: orders.map(({ id }) => ({
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
    it('should call stripe.checkout.sessions.expire, getOrdersFromStripeCheckoutSession, markOrderAsCancelled, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [
        {
          id: 'order1',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 100,
          },
        },
        {
          id: 'order2',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 200,
          },
        },
      ];
      payment.stripe.checkout.sessions.expire = jest.fn().mockResolvedValue({});
      payment.getOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markOrderAsCancelled = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.expireStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(payment.stripe.checkout.sessions.expire).toHaveBeenCalledWith(
        stripeCheckoutSessionId,
      );
      expect(payment.getOrdersFromStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSessionId,
      });
      expect(payment.markOrderAsCancelled).toHaveBeenCalledWith({
        ordersId: orders.map((order) => order.id),
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
  });
  describe('getOrdersFromStripeCheckoutSession', () => {
    it('should call adminSdk.GetOrdersFromStripeCheckoutSession with correct parameters and return the result', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const order = [{ id: 'order1' }, { id: 'order2' }];
      adminSdk.GetOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue({ order });

      const result = await payment.getOrdersFromStripeCheckoutSession({
        stripeCheckoutSessionId,
      });

      expect(adminSdk.GetOrdersFromStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSessionId,
      });
      expect(result).toEqual(order);
    });
  });
  describe('getStripeActiveCheckoutSessionForUser', () => {
    it('should call adminSdk.GetStripeCheckoutSessionForUser with correct parameters and return null if no active session', async () => {
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
    it('should call getOrdersFromStripeCheckoutSession, markOrderAsCancelled, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [
        {
          id: 'order1',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 100,
          },
        },
        {
          id: 'order2',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 200,
          },
        },
      ];
      payment.getOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markOrderAsCancelled = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.canceledStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(payment.getOrdersFromStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSessionId,
      });
      expect(payment.markOrderAsCancelled).toHaveBeenCalledWith({
        ordersId: orders.map((order) => order.id),
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
  });
  describe('confirmedStripeCheckoutSession', () => {
    it('should call getOrdersFromStripeCheckoutSession, nftClaimable.checkOrder, markOrderAsCompleted, and adminSdk.DeleteStripeCheckoutSession with correct parameters', async () => {
      const stripeCheckoutSessionId = 'sessionId';
      const orders = [
        {
          id: 'order1',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 100,
          },
        },
        {
          id: 'order2',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 200,
          },
        },
      ];
      payment.getOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.nftClaimable.checkOrder = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      await payment.confirmedStripeCheckoutSession({ stripeCheckoutSessionId });

      expect(payment.getOrdersFromStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSessionId,
      });
      expect(payment.nftClaimable.checkOrder).toHaveBeenCalledTimes(
        orders.length,
      );
      orders.forEach((order, index) => {
        expect(payment.nftClaimable.checkOrder).toHaveBeenNthCalledWith(
          index + 1,
          order,
        );
      });
      expect(adminSdk.DeleteStripeCheckoutSession).toHaveBeenCalledWith({
        stripeSessionId: stripeCheckoutSessionId,
      });
    });
    it('should throw an error when getOrdersFromStripeCheckoutSession fails', async () => {
      payment.getOrdersFromStripeCheckoutSession = jest
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

    it('should throw an error when checkOrder fails', async () => {
      payment.nftClaimable.checkOrder = jest
        .fn()
        .mockRejectedValue(new Error('Failed to claim NFTs'));
      payment.getOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue([{ id: 'order1' }, { id: 'order2' }]);
      adminSdk.DeleteStripeCheckoutSession = jest.fn();

      await expect(
        payment.confirmedStripeCheckoutSession({
          stripeCheckoutSessionId: 'test',
        }),
      ).rejects.toThrow('Error claiming NFTs : Failed to claim NFTs');
      expect(adminSdk.DeleteStripeCheckoutSession).not.toHaveBeenCalled();
    });
  });
  describe('refundPayment', () => {
    it('should call stripe.refunds.create, getOrdersFromStripeCheckoutSession, markOrderAsRefunded, and adminSdk.DeleteStripeCheckoutSession with correct parameters and return the refund', async () => {
      const paymentIntentId = 'paymentIntentId';
      const checkoutSessionId = 'checkoutSessionId';
      const refund = { status: 'succeeded' };
      const orders = [
        {
          id: 'order1',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 100,
          },
        },
        {
          id: 'order2',
          passPricing: {
            currency: Currency_Enum.Usd,
            amount: 200,
          },
        },
      ];
      payment.stripe.refunds.create = jest.fn().mockResolvedValue(refund);
      payment.getOrdersFromStripeCheckoutSession = jest
        .fn()
        .mockResolvedValue(orders);
      payment.markOrderAsRefunded = jest.fn().mockResolvedValue({});
      adminSdk.DeleteStripeCheckoutSession = jest.fn().mockResolvedValue({});

      const result = await payment.refundPayment({
        paymentIntentId,
        checkoutSessionId,
      });

      expect(payment.stripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId,
      });
      expect(payment.getOrdersFromStripeCheckoutSession).toHaveBeenCalledWith({
        stripeCheckoutSessionId: checkoutSessionId,
      });
      expect(payment.markOrderAsRefunded).toHaveBeenCalledWith({
        ordersId: orders.map((order) => order.id),
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

  describe('calculateUnitAmount', () => {
    it('should return calculated amount if currency is not the same as priceCurrency and currency has a lower rate', () => {
      const order = {
        passPricing: {
          amount: 100,
          currency: Currency_Enum.Usd,
        },
      };
      const rates = {
        USD: {
          USD: 1,
          EUR: 0.85,
        },
        EUR: {
          USD: 1.15,
          EUR: 1,
        },
      } as CurrencyRates;

      const result = calculateUnitAmount(order.passPricing, rates);

      expect(result).toEqual(85);
    });
  });

  it('should return calculated amount if currency is not the same as priceCurrency and currency has a higher rate', () => {
    const order = {
      passPricing: {
        amount: 100,
        currency: Currency_Enum.Usd,
      },
    };
    const rates = {
      USD: {
        EUR: 1.15,
        USD: 1,
      },
      EUR: {
        EUR: 1,
        USD: 0.85,
      },
    } as CurrencyRates;

    const result = calculateUnitAmount(order.passPricing, rates);

    expect(result).toEqual(115);
  });

  it('should return calculated amount if currency is not the same complex amount', () => {
    const order = {
      passPricing: {
        amount: 123456,
        currency: Currency_Enum.Usd,
      },
    };
    const rates = {
      USD: {
        EUR: 0.85,
        USD: 1,
      },
      EUR: {
        EUR: 1,
        USD: 1.15,
      },
    } as CurrencyRates;

    const result = calculateUnitAmount(order.passPricing, rates);

    expect(result).toEqual(104938);
  });

  it('should return calculated amount if currency is not the same complex amount complex rate', () => {
    const order = {
      passPricing: {
        amount: 123456789,
        currency: Currency_Enum.Usd,
      },
    };
    const rates = {
      USD: {
        EUR: 0.798,
        USD: 1,
      },
      EUR: {
        EUR: 1,
        USD: 1.15,
      },
    } as CurrencyRates;

    const result = calculateUnitAmount(order.passPricing, rates);

    expect(result).toEqual(98518518);
  });

  it('should handle large amount without overflow', () => {
    const order = {
      passPricing: {
        amount: Number.MAX_SAFE_INTEGER,
        currency: Currency_Enum.Usd,
      },
    };
    const rates = {
      USD: {
        EUR: 0.85,
        USD: 1,
      },
      EUR: {
        EUR: 1,
        USD: 1.15,
      },
    } as CurrencyRates;

    const result = calculateUnitAmount(order.passPricing, rates);

    expect(result).toBeCloseTo(Number.MAX_SAFE_INTEGER * 0.85);
  });
});
