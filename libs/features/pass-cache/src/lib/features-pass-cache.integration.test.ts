import { adminSdk } from '@gql/admin/api';
import { Stage } from '@gql/shared/types';
import { userSdk } from '@gql/user/api';
import { resetCache } from '@test-utils/cache';
import {
  PgClient,
  applySeeds,
  createDbClient,
  deleteTables,
} from '@test-utils/db';
import { alphaUserClient } from '@test-utils/gql';
import { PassCache } from './features-pass-cache';

jest.mock('@next/next-auth/user');

describe('PassCache Integration Test', () => {
  let passCache: PassCache;
  let client: PgClient;

  const alphaUser = alphaUserClient();

  beforeAll(async () => {
    client = await createDbClient();
    await resetCache();
    await applySeeds(client, ['account', 'eventPassPricing']);
  });

  beforeEach(() => {
    passCache = new PassCache();
  });

  afterAll(async () => {
    await deleteTables(client, ['account', 'eventPassPricing']);
    await client.end();
  });

  it('should get passes cart when there are none and return null', async () => {
    const passesCart = await passCache.getPassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    expect(passesCart).toEqual(null);
  });

  it('should set and get all passes cart', async () => {
    const passesCart = {
      'test-organizer': {
        'test-event': [
          {
            eventPassId: 'fake-event-pass-1',
            quantity: 1,
          },
        ],
      },
    };
    await passCache.setAllPassesCart(passesCart);
    const result = await passCache.getAllPassesCart();
    expect(result).toEqual(passesCart);
  });

  it('should update and get passes cart', async () => {
    const pass = {
      eventPassId: 'fake-event-pass-1',
      quantity: 2,
    };
    const slugs = {
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    };
    await passCache.updatePassCart({
      ...slugs,
      pass,
    });
    const result = await passCache.getPassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    expect(result).toContainEqual(pass);
  });

  it('should delete passes cart', async () => {
    await passCache.deletePassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    const result = await passCache.getPassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    expect(result).toEqual(null);
  });

  it('should transfer passes cart to DB and delete cache cart', async () => {
    jest
      .spyOn(userSdk, 'UpsertPendingOrders')
      .mockImplementation(async (params) => {
        return await alphaUser.UpsertPendingOrders({
          objects: params.objects,
          stage: 'DRAFT' as Stage,
        });
      });
    const passesCart = {
      'test-organizer': {
        'test-event': [
          {
            eventPassId: 'fake-event-pass-1',
            quantity: 2,
          },
        ],
      },
    };
    await passCache.setAllPassesCart(passesCart);
    const transferred = await passCache.transferPassesCartToDb();
    const emptyPassesCart = await passCache.getPassesCart({
      organizerSlug: 'test-organizer',
      eventSlug: 'test-event',
    });
    expect(emptyPassesCart).toEqual(null);

    const dataFromDb = await adminSdk.GetPendingOrders();

    expect(transferred).toBeDefined();
    const isIdInDb =
      transferred &&
      dataFromDb.pendingOrder.some((order) => order.id === transferred[0].id);
    expect(isIdInDb).toEqual(true);
  });
});
