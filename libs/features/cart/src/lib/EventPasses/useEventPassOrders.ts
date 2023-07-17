import { useQueryClient } from '@tanstack/react-query';
import {
  useGetEventWithPassesQuery,
  useGetEventPassOrderForEventPassesQuery,
  useUpsertEventPassOrdersMutation,
  useDeleteEventPassOrdersMutation,
} from '@gql/user/api';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { useStore } from '@next/store';
import type {
  EventPassCart,
  EventSlugs,
} from '@features/organizer/event/types';
import type { Locale, Stage } from '@gql/shared/types';

export interface EventPassesSliceProps extends EventSlugs {
  locale: Locale;
  passes: EventPassCart[];
}

export const useEventPassOrders = ({
  organizerSlug,
  eventSlug,
  locale,
  passes,
}: EventPassesSliceProps) => {
  const store = useStore(usePassPurchaseStore, (state) => state);
  const queryClient = useQueryClient();

  const { data: eventData, isLoading: eventIsLoading } =
    useGetEventWithPassesQuery({
      slug: eventSlug,
      locale,
      stage: process.env.NEXT_PUBLIC_HYGRAPH_STAGE as Stage,
    });

  const eventPassIds = passes.map((pass) => pass.id);

  const { data: ordersData, isLoading: ordersIsLoading } =
    useGetEventPassOrderForEventPassesQuery(
      {
        eventPassIds,
      },
      { enabled: !!eventPassIds }
    );

  const mutationOptions = {
    onSuccess: () => {
      queryClient.invalidateQueries([
        'GetEventPassOrderForEventPasses',
        { organizerSlug, eventSlug },
      ]);
    },
  };

  const mutationUpsert = useUpsertEventPassOrdersMutation(mutationOptions);
  const mutationDelete = useDeleteEventPassOrdersMutation(mutationOptions);

  const upsertOrders = async (orders: EventPassCart[]) => {
    try {
      return mutationUpsert.mutateAsync({
        objects: orders.map((order) => ({
          eventPassId: order.id,
          quantity: order.amount,
        })),
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteOrders = async () => {
    try {
      return mutationDelete.mutateAsync({
        eventPassIds: passes?.map((pass) => pass.id) || [],
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const syncLocalStorageWithDb = async () => {
    console.log('syncLocalStorageWithDb');
    const res = await upsertOrders(passes);
    console.log({ res });
  };

  return {
    eventData,
    eventIsLoading,
    ordersData,
    ordersIsLoading,
    upsertOrders,
    deleteOrders,
    syncLocalStorageWithDb,
  };
};
