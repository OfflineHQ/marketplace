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
  it('should work correctly', async () => {
    Object.defineProperty(window, 'jwtTestToken', {
      value: usersJwt.alpha_user,
    });
    const { result } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
          passes: [{ id: 'fake-event-pass-1', amount: 1 }],
        }),
      {
        wrapper: QueryClientProviderForTest,
      }
    );

    await waitFor(() => {
      console.log('checking ordersData:', result.current.ordersData);
      expect(result.current.ordersData).toBeDefined();

      // Add your assertions to test the behavior of the hook
      // ...
    });
  });
});
