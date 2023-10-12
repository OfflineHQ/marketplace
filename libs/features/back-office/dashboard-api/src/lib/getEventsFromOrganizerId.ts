import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface getEventsFromOrganizerIdProps {
  id: string;
  locale: string;
}

export const getEventsFromOrganizerId = cache(
  async ({ id, locale }: getEventsFromOrganizerIdProps): Promise<unknown> => {
    const data = await adminSdk.GetEventsFromOrganizerId({
      id: id,
      locale: locale as Locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer?.events;
  }
);
