import { renderHook, waitFor } from '@testing-library/react';
import { useEventPassOrders } from './useEventPassOrders';
import { usersJwt } from '@test-utils/gql';
import { QueryClientProviderForTest } from '@test-utils/react-query';
import { Locale } from '@gql/shared/types';
import {
  deleteAccounts,
  createDbClient,
  deleteTables,
  seedDb,
  type PgClient,
} from '@test-utils/db';

// import { useGetEventWithPassesQuery } from '@gql/user/react-query'; // update this import path as per your actual path

jest.mock('@gql/user/react-query', () => ({
  ...jest.requireActual('@gql/user/react-query'),
  useGetEventWithPassesQuery: jest.fn(() => ({
    data: {
      event: {
        id: 'test-event-id',
        slug: 'test-event',
        title: 'Test Event',
        heroImage: {
          url: 'http://test-event.com/hero.jpg',
        },
        organizer: {
          id: 'test-organizer-id',
          slug: 'test-organizer',
          name: 'Test Organizer',
          image: {
            url: 'http://test-organizer.com/image.jpg',
          },
        },
        eventPasses: [
          {
            id: 'fake-event-pass-1',
            name: 'Fake Event Pass 1',
            description: 'This is a fake event pass',
            eventPassPricing: {
              priceAmount: 120000,
              priceCurrency: 'EUR',
            },
          },
          {
            id: 'fake-event-pass-2',
            name: 'Fake Event Pass 2',
            description: 'This is a fake event pass',
            eventPassPricing: {
              priceAmount: 130000,
              priceCurrency: 'EUR',
            },
          },
        ],
      },
    },
  })),
}));

global.window = Object.create(window);
describe('useEventPassOrders', () => {
  let client: PgClient;
  beforeAll(async () => {
    client = await createDbClient();
    await deleteAccounts(client);
    await seedDb(client, './hasura/app/seeds/default/account.sql');
  });
  afterAll(async () => {
    await deleteAccounts(client);
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await client.end();
  });
  beforeEach(async () => {
    await deleteTables(client, '"eventPassPendingOrder", "eventPassPricing"');
    await seedDb(client, './hasura/app/seeds/default/eventPassPricing.sql');
    await seedDb(
      client,
      './hasura/app/seeds/default/eventPassPendingOrder.sql'
    );
  });
  it('Should retrieve existing order for an event from database', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.beta_user,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
          localPasses: [],
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(1);
      expect(
        result.current.ordersData?.eventPassPendingOrder[0].eventPassId
      ).toBe('fake-event-pass-1');
    });
  });
  it('Should retrieve multiple existing order for an event from database', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.alpha_user,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
          localPasses: [],
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      expect(result.current.eventData).toBeDefined();
      expect(result.current.ordersData).toBeDefined();
      expect(result.current.ordersData?.eventPassPendingOrder.length).toBe(2);
    });
  });
});
