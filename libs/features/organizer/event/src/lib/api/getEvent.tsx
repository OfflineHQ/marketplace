import { cache } from 'react';
import { adminSdk } from '@next/gql/admin';
import type { Event } from '@features/organizer/event/types';
import type { Locale, Stage } from '@next/gql/admin/types';

interface GetEventProps {
  eventSlug: string;
  locale: string;
}

export const getEvent = cache(
  async ({ eventSlug, locale }: GetEventProps): Promise<Event | null> => {
    const data = await adminSdk.GetEvent({
      slug: eventSlug,
      locale: locale as Locale,
      stage: process.env.HYGRAPH_STAGE as Stage,
    });
    return data?.event || null;
  }
);
