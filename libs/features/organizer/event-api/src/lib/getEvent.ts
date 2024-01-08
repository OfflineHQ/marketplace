import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import { EventStatus_Enum, type Locale, type Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetEventProps {
  eventSlug: string;
  locale: string;
}

export const getEvent = cache(async ({ eventSlug, locale }: GetEventProps) => {
  const data = await adminSdk.GetEvent({
    slug: eventSlug,
    locale: locale as Locale,
    stage: env.HYGRAPH_STAGE as Stage,
  });
  const event = data?.event;
  if (event?.eventParameters?.status === EventStatus_Enum.Published)
    return event;
});
