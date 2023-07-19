import { renderHook, waitFor } from '@testing-library/react';
import { useEventPassOrders } from './useEventPassOrders';
import { fetchDataReactQueryForTest, usersJwt } from '@test-utils/gql';
import { QueryClientProviderForTest } from '@test-utils/react';
import { Locale } from '@gql/shared/types';

describe('useEventPassOrders', () => {
  it('should work correctly', async () => {
    jest.mock('@next/hasura/fetcher', () => {
      return {
        fetchDataReactQuery: fetchDataReactQueryForTest(usersJwt.alpha_user),
      };
    });
    const { result } = renderHook(
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
      // expect(result.current).toEqual({
      // 	data: {
      // 		event: {
      // 			id: 'test-event',
    });

    // Add your assertions to test the behavior of the hook
    // ...
  });
});
