import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetContentSpaceWithPassesOrganizer {
  slug: string;
  locale: string;
}

export const getContentSpaceWithPassesOrganizer = cache(
  async ({ slug, locale }: GetContentSpaceWithPassesOrganizer) => {
    const data = await adminSdk.GetContentSpaceWithPassesOrganizer(
      {
        slug,
        locale: locale as Locale,
        stage: env.HYGRAPH_STAGE as Stage,
      },
      {
        next: {
          tags: [`${slug}-getContentSpaceWithPassesOrganizer`],
        },
      },
    );
    return data?.contentSpace;
  },
);
