import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetOrganizerFromSlugProps {
  slug: string;
}

export const getOrganizerFromSlug = cache(
  async ({ slug }: GetOrganizerFromSlugProps) => {
    const data = await adminSdk.GetOrganizerFromSlug({
      slug,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer;
  },
);
