import { useQueryClient } from '@tanstack/react-query';
import {
  useGetEventWithPassesQuery,
  useGetEventPassPendingOrderForEventPassesQuery,
  useInsertEventPassPendingOrdersMutation,
  useDeleteEventPassPendingOrdersMutation,
} from '@gql/user/react-query';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import type {
  EventPassCart,
  EventSlugs,
} from '@features/organizer/event/types';
import type { Locale, Stage } from '@gql/shared/types';

export interface EventPassesSliceProps extends EventSlugs {
  locale: Locale;
}

export const useEventPassOrders = ({
  organizerSlug,
  eventSlug,
  locale,
}: EventPassesSliceProps) => {
  const store = usePassPurchaseStore();
  // const store = useStore(usePassPurchaseStore, (state) => state);
  const queryClient = useQueryClient();

  const { data: eventData, isLoading: eventIsLoading } =
    useGetEventWithPassesQuery({
      slug: eventSlug,
      locale,
      stage: process.env.NEXT_PUBLIC_HYGRAPH_STAGE as Stage,
    });

  const eventPassIds =
    eventData?.event?.eventPasses.map((pass) => pass.id) || [];

  const {
    data: ordersData,
    isLoading: ordersIsLoading,
    isFetching: ordersIsFetching,
  } = useGetEventPassPendingOrderForEventPassesQuery({
    eventPassIds,
  });
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'GetEventPassPendingOrderForEventPasses',
        { eventPassIds },
      ]);
    },
  };

  const mutationInsert =
    useInsertEventPassPendingOrdersMutation(mutationOptions);
  const mutationDelete =
    useDeleteEventPassPendingOrdersMutation(mutationOptions);

  const upsertOrders = async (localPasses: EventPassCart[]) => {
    try {
      if (!ordersData) {
        throw new Error('ordersData is undefined');
      }
      if (eventIsLoading) {
        throw new Error('Event data is still loading');
      }
      // Mapping of eventPassId to quantity from the local storage
      const localPassesMap = localPasses.reduce((map, pass) => {
        map[pass.id] = pass.amount;
        return map;
      }, {} as Record<string, number>);

      // Mapping of eventPassId to quantity from the database
      const dbPassesMap = ordersData.eventPassPendingOrder.reduce(
        (map, order) => {
          map[order.eventPassId] = order.quantity;
          return map;
        },
        {} as Record<string, number>
      );

      // Orders to insert into the database
      const ordersToInsert = [];

      // Orders to delete from the database
      const idsToDelete = [];

      // Loop over each local pass
      for (const pass of localPasses) {
        const dbQuantity = dbPassesMap[pass.id];

        // If the pass does not exist in the database or if the quantities are different
        if (dbQuantity === undefined || dbQuantity !== pass.amount) {
          // Add the pass to the list of orders to insert into the database
          ordersToInsert.push({ eventPassId: pass.id, quantity: pass.amount });

          // If the pass already exists in the database but with a different quantity, add it to the list of orders to delete
          if (dbQuantity !== undefined) {
            idsToDelete.push(pass.id);
          }
        }
      }
      // Loop over each db order
      for (const order of ordersData.eventPassPendingOrder) {
        const localQuantity = localPassesMap[order.eventPassId];

        // If the order does not exist in local storage
        if (localQuantity === undefined) {
          // Add the order to local storage
          store.updatePassCart({
            organizerSlug,
            eventSlug,
            pass: {
              id: order.eventPassId,
              amount: order.quantity,
            },
          });
        }
      }
      // Delete orders from the database
      if (idsToDelete.length > 0) {
        await mutationDelete.mutateAsync({ eventPassIds: idsToDelete });
      }

      // Insert new orders into the database
      if (ordersToInsert.length > 0) {
        await mutationInsert.mutateAsync({ objects: ordersToInsert });
      }

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteOrders = async (localPasses: EventPassCart[]) => {
    try {
      await mutationDelete.mutateAsync({
        eventPassIds: localPasses?.map((pass) => pass.id) || [],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    eventData,
    eventIsLoading,
    ordersData,
    ordersIsLoading,
    ordersIsFetching,
    upsertOrders,
    deleteOrders,
  };
};
