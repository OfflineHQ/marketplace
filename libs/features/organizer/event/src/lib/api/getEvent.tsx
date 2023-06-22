import { cache } from 'react';
import { adminSdk } from '@next/gql/admin';
import type { Event } from '@features/organizer/event/types';

interface GetEventProps {
  eventSlug: string;
  locale: string;
}

export const getEvent = cache(
  async ({ eventSlug, locale }: GetEventProps): Promise<Event> => {
    const data = await adminSdk.GetEvent({
      slug: eventSlug,
      locale,
      stage: process.env.HYGRAPH_STAGE,
    });
    return data?.event || null;
  }
);
