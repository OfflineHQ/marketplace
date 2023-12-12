import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface getEventsFromOrganizerIdTableProps {
  id: string;
  locale: Locale;
}

export const getEventsFromOrganizerIdTable = cache(
  async ({ id, locale }: getEventsFromOrganizerIdTableProps) => {
    const data = await adminSdk.GetEventsFromOrganizerIdTable({
      id: id,
      locale: locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer?.events;
  },
);
