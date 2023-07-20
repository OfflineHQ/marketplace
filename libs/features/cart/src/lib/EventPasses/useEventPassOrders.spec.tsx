import { renderHook, waitFor } from '@testing-library/react';
import { useEventPassOrders } from './useEventPassOrders';
import { usersJwt } from '@test-utils/gql';
import { QueryClientProviderForTest } from '@test-utils/react';
import { Locale } from '@gql/shared/types';

// jest.mock('@next/hasura/fetcher', () => {
//   return {
//     fetchDataReactQuery: fetchDataReactQueryForTest(usersJwt.alpha_user),
//   };
// });

describe('useEventPassOrders', () => {
  it('should work correctly', async () => {
    const {
      result: {
        current: { eventData, ordersData, upsertOrders, deleteOrders },
      },
    } = renderHook(
      () =>
        useEventPassOrders({
          organizerSlug: 'test-organizer',
          eventSlug: 'test-event',
          locale: Locale.En,
          passes: [],
        }),
      { wrapper: QueryClientProviderForTest }
    );

    await waitFor(() => {
      return expect(ordersData).toBeDefined();

      // Add your assertions to test the behavior of the hook
      // ...
    });
  });
});
