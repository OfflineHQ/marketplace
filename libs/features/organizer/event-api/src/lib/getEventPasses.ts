import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { EventStatus_Enum, type Locale, type Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetEventPassesProps {
  eventSlug: string;
  locale: string;
}

export const getEventPasses = cache(
  async ({ eventSlug, locale }: GetEventPassesProps) => {
    const data = await adminSdk.GetEventParametersAndEventPasses({
      eventSlug: eventSlug,
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    const event = data?.event;
    if (event?.eventParameters?.status === EventStatus_Enum.Published)
      return data;
  },
);
