import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';
import { getOrganizerFromSlug } from './getOrganizerFromSlug';

interface GetOrganizerLatestEventsProps {
  slug: string;
  locale: string;
}

export const getOrganizerLatestEvents = cache(
  async ({ slug, locale }: GetOrganizerLatestEventsProps) => {
    const organizer = await getOrganizerFromSlug({
      slug,
    });
    if (!organizer) throw new Error(`Organizer with slug ${slug} not found`);
    const data = await adminSdk.GetOrganizerLatestEvents({
      organizerId: organizer.id,
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.eventParameters;
  },
);
