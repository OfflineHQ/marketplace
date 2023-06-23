import type { Locale, Stage } from '@gql/shared/types';
import { adminSdk } from '@gql/admin/api';
import { cache } from 'react';

interface GetEventPassesProps {
  eventSlug: string;
  locale: string;
}

export const getEventPasses = cache(
  async ({ eventSlug, locale }: GetEventPassesProps) => {
    const data = await adminSdk.GetEventPasses({
      eventSlug: eventSlug,
      locale: locale as Locale,
      stage: process.env.HYGRAPH_STAGE as Stage,
    });
    return data?.eventPasses;
  }
);
