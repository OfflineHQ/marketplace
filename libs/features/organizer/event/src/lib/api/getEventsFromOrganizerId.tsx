import { cache } from 'react';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';

interface getEventsFromOrganizerIdProps {
  id: string;
  locale: string;
}

export const getEventsFromOrganizerId = cache(
  async ({ id, locale }: getEventsFromOrganizerIdProps) => {
    const data = await adminSdk.GetEventWithFromOrganizerId({
      id: id,
      locale: locale as Locale,
      stage: process.env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer?.events;
  }
);
