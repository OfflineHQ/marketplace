import { useQueryClient } from '@tanstack/react-query';
import {
  useGetEventWithPassesQuery,
  useGetEventPassPendingOrderForEventPassesQuery,
  useInsertEventPassPendingOrdersMutation,
  useDeleteEventPassPendingOrdersMutation,
} from '@gql/user/react-query';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@next/store';
import type {
  EventPassCart,
  EventSlugs,
} from '@features/organizer/event/types';
import type { Locale, Stage } from '@gql/shared/types';

export interface EventPassesSliceProps extends EventSlugs {
  locale: Locale;
  localPasses: EventPassCart[];
}

export const useEventPassOrders = ({
  organizerSlug,
  eventSlug,
  locale,
  localPasses,
}: EventPassesSliceProps) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
  const queryClient = useQueryClient();

  const { data: eventData, isLoading: eventIsLoading } =
    useGetEventWithPassesQuery({
      slug: eventSlug,
      locale,
      stage: process.env.NEXT_PUBLIC_HYGRAPH_STAGE as Stage,
    });

  const eventPassIds =
    eventData?.event?.eventPasses.map((pass) => pass.id) || [];
  const localEventPassIds = localPasses.map((pass) => pass.id);

  const { data: ordersData, isLoading: ordersIsLoading } =
    useGetEventPassPendingOrderForEventPassesQuery(
      {
        eventPassIds,
      },
      { enabled: !!localEventPassIds }
    );
  console.log(
    'ordersData',
    ordersData,
    'eventPassIds',
    eventPassIds,
    'localEventPassIds',
    localEventPassIds,
    'ordersIsLoading',
    ordersIsLoading
  );
  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'GetEventPassPendingOrderForEventPasses',
        { organizerSlug, eventSlug },
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
      const eventPassIdsSet = new Set(
        ordersData.eventPassPendingOrder?.map((order) => order.eventPassId)
      );
      const passIdsSet = new Set(localEventPassIds);

      const ordersToInsert: { eventPassId: string; quantity: number }[] = [];

      const idsToDelete: string[] = [];

      for (const pass of localPasses) {
        if (!eventPassIdsSet.has(pass.id)) {
          ordersToInsert.push({
            eventPassId: pass.id,
            quantity: pass.amount,
          });
        }
      }

      for (const eventPassId of eventPassIdsSet) {
        if (!passIdsSet.has(eventPassId)) {
          idsToDelete.push(eventPassId);
        }
      }

      if (ordersToInsert.length > 0) {
        await mutationInsert.mutateAsync({
          objects: ordersToInsert,
        });
      }

      if (idsToDelete.length > 0) {
        await mutationDelete.mutateAsync({
          eventPassIds: idsToDelete,
        });
      }

      return true;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteOrders = async () => {
    try {
      return mutationDelete.mutateAsync({
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
    upsertOrders,
    deleteOrders,
  };
};
