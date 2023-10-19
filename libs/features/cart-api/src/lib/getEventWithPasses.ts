import env from '@env/server';
import { EventSlugs } from '@features/organizer/event-types';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetEventPassesProps extends Pick<EventSlugs, 'eventSlug'> {
  locale: string;
}

export const getEventWithPasses = cache(
  async ({ eventSlug, locale }: GetEventPassesProps) => {
    const data = await adminSdk.GetEventWithPasses({
      slug: eventSlug,
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.event;
  },
);
