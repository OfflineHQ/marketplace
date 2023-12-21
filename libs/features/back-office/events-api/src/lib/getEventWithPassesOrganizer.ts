import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface GetEventWithPassesOrganizer {
  slug: string;
  locale: string;
}

export const getEventWithPassesOrganizer = cache(
  async ({ slug, locale }: GetEventWithPassesOrganizer) => {
    const data = await adminSdk.GetEventWithPassesOrganizer(
      {
        slug,
        locale: locale as Locale,
        stage: env.HYGRAPH_STAGE as Stage,
      },
      {
        next: {
          tags: [`${slug}-getEventWithPassesOrganizer`],
        },
      },
    );
    return data?.event;
  },
);
