import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetEventPassDelayedRevealedFromEventPassIdOrganizerProps {
  eventPassId: string;
  locale: Locale;
}

export const getEventPassDelayedRevealedFromEventPassIdOrganizer = cache(
  async ({
    eventPassId,
    locale,
  }: GetEventPassDelayedRevealedFromEventPassIdOrganizerProps) => {
    const data = await adminSdk.GetEventPassDelayedRevealedFromEventPassId({
      eventPassId: eventPassId,
      locale: locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.eventPass?.eventPassDelayedRevealed;
  },
);
