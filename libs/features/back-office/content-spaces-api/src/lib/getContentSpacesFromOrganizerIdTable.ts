import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import { cache } from 'react';

interface getContentSpacesFromOrganizerIdTableProps {
  id: string;
  locale: Locale;
}

export const getContentSpacesFromOrganizerIdTable = cache(
  async ({ id, locale }: getContentSpacesFromOrganizerIdTableProps) => {
    const data = await adminSdk.GetContentSpacesFromOrganizerIdTable({
      id: id,
      locale: locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.organizer?.contentSpaces;
  },
);
