import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetOrganizerProps {
  slug: string;
  locale: string;
}

export const getOrganizer = cache(
  async ({ slug, locale }: GetOrganizerProps) => {
    const data = await adminSdk.GetOrganizer({
      slug,
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer;
  },
);
