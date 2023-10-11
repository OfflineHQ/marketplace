import * as kycApi from '@features/kyc-api';
import { adminSdk } from '@gql/admin/api';
import {
  KycStatus_Enum,
  Locale,
  OrderStatus_Enum,
  Stage,
} from '@gql/shared/types';
import { StripeCustomer } from '@payment/types';
import {
  applySeeds,
  createDbClient,
  deleteAllTables,
  deleteTables,
  eventPassPendingOrders,
  type PgClient,
} from '@test-utils/db';
import { accounts, alphaUserClient } from '@test-utils/gql';
import { Payment } from './payment-admin';

jest.mock('@features/kyc-api');
jest.mock('@nft/thirdweb-admin');

const payment = new Payment();

const alphaUser = alphaUserClient();

describe('Payment integration', () => {
  let client: PgClient;

  beforeAll(async () => {
    client = await createDbClient();
    payment.stripe = {
      customers: {
        create: jest.fn(),
      },
      checkout: {
        sessions: {
          retrieve: jest.fn(),
          create: jest.fn(),
          expire: jest.fn(),
        },
      },
      refunds: {
        create: jest.fn(),
      },
    } as any;
  });

  afterAll(async () => {
    await deleteAllTables(client);
    await client.end();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    // jest.resetAllMocks();
    await deleteAllTables(client);
    await applySeeds(client, [
      'account',
      'eventPassNftContract',
      'eventParameters',
      'eventPassPricing',
      'eventPassPendingOrder',
      'eventPassOrder',
      'eventPassNft',
      'stripeCustomer',
      'stripeCheckoutSession',
    ]);
  });

  describe('createStripeCustomer', () => {
    it('should return stripe customer if it already exist in db', async () => {
      jest.spyOn(adminSdk, 'CreateStripeCustomer');
      const res = await payment.createStripeCustomer({
        user: accounts.alpha_user,
      });
      expect(res).toEqual({
        accountId: accounts.alpha_user.id,
        stripeCustomerId: 'cus_OnE9GqPxIIPYtB',
      });
      expect(payment.stripe.customers.create).not.toHaveBeenCalled();
      expect(adminSdk.CreateStripeCustomer).not.toHaveBeenCalled();
    });
    it('should create a new stripe customer if it does not exist in db', async () => {
      await deleteTables(client, ['stripeCustomer']);
      // Mock the getSumSubApplicantPersonalData function
      (kycApi.getSumSubApplicantPersonalData as jest.Mock).mockResolvedValue({
        review: {
          reviewStatus: KycStatus_Enum.Completed,
        },
        email: 'alpha_user@example.com',
        lang: 'en',
        phone: '1234567890',
      });

      // Mock the stripe.customers.create function
      payment.stripe.customers.create = jest.fn().mockResolvedValue({
        id: 'new_stripe_customer_id',
      });

      const res = await payment.createStripeCustomer({
        user: accounts.alpha_user,
      });

      expect(res).toEqual({
        stripeCustomerId: 'new_stripe_customer_id',
        accountId: accounts.alpha_user.id,
      });

      expect(payment.stripe.customers.create).toHaveBeenCalledWith({
        email: 'alpha_user@example.com',
        preferred_locales: ['en'],
        phone: '1234567890',
        metadata: {
          userId: accounts.alpha_user.id,
        },
      });
    });
  });

  describe('moveEventPassPendingOrdersToConfirmed', () => {
    it('should move eventPassPendingOrders to confirmed and delete existing eventPassPendingOrders', async () => {
      // Prepare the eventPassPendingOrders, accountId, and locale
      const accountId = accounts.alpha_user.id;
      const locale = Locale.En;

      // Call the method
      const res = await payment.moveEventPassPendingOrdersToConfirmed({
        eventPassPendingOrders: eventPassPendingOrders.alpha_user,
        accountId,
        locale,
      });

      // Verify the eventPassOrders are created with status CONFIRMED
      for (const order of res) {
        expect(order.status).toEqual(OrderStatus_Enum.Confirmed);
        expect(order.accountId).toEqual(accountId);
      }

      // Verify the eventPassPendingOrders are deleted
      const data = await alphaUser.GetEventPassPendingOrders({
        locale,
        stage: 'DRAFT' as Stage,
      });
      const orders = data.eventPassPendingOrder;
      expect(orders?.length).toBe(0);
    });
  });

  describe('createStripeCheckoutSession', () => {
    const user = accounts.alpha_user;

    const stripeSession = {
      id: 'stripe_session_id',
    };

    const locale = Locale.En;
    const currency = 'usd';

    beforeEach(() => {
      (payment.stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
        id: stripeSession.id,
      });
    });
    it('should throw an error if the user does not have a stripe customer', async () => {
      const stripeCustomer = {
        id: 'fake_stripe_customer_id',
        email: 'alpha_user@example.com',
      };
      await expect(
        payment.createStripeCheckoutSession({
          user,
          stripeCustomer: stripeCustomer as StripeCustomer,
          eventPassPendingOrders: eventPassPendingOrders.alpha_user,
          locale,
          currency,
        })
      ).rejects.toThrow(/violates foreign key constraint/i);
    });
    it('should throw an error if the user already have an active stripe checkout session', async () => {
      const stripeCustomer = {
        id: 'cus_OnE9GqPxIIPYtB',
        email: 'alpha_user@example.com',
      };
      await expect(
        payment.createStripeCheckoutSession({
          user,
          stripeCustomer: stripeCustomer as StripeCustomer,
          eventPassPendingOrders: [],
          locale,
          currency,
        })
      ).rejects.toThrow(/already has an active checkout session/i);
    });
    it('should create a new stripe checkout session', async () => {
      await deleteTables(client, ['stripeCheckoutSession']);
      const stripeCustomer = {
        id: 'cus_OnE9GqPxIIPYtB',
        email: 'alpha_user@example.com',
      };
      const stripeSession = await payment.createStripeCheckoutSession({
        user,
        stripeCustomer: stripeCustomer as StripeCustomer,
        eventPassPendingOrders: eventPassPendingOrders.alpha_user,
        locale,
        currency,
      });

      // Verify the Stripe checkout session is created
      (
        payment.stripe.checkout.sessions.retrieve as jest.Mock
      ).mockImplementation((id) => ({ id }));

      const stripeSessionForUser =
        await payment.getStripeActiveCheckoutSessionForUser({
          stripeCustomerId: stripeCustomer.id,
        });
      expect(stripeSessionForUser).not.toBeNull();

      console.log(stripeSession);
      // Verify that the order are assigned to the checkout session
      const orders = await payment.getEventPassOrdersFromStripeCheckoutSession({
        stripeCheckoutSessionId: stripeSession.stripeSessionId,
      });
      console.log(orders);
      expect(orders.length).toBe(2);
    });
  });
});
