import { cache } from 'react';
import { adminSdk } from '@gql/admin/api';
import type { Locale, Stage } from '@gql/shared/types';
import env from '@env/server';

interface GetEventProps {
  eventSlug: string;
  locale: string;
}

export const getEvent = cache(async ({ eventSlug, locale }: GetEventProps) => {
  const data = await adminSdk.GetEvent({
    slug: eventSlug,
    locale: locale as Locale,
    stage: env.HYGRAPH_STAGE as Stage,
  });
  return data?.event;
});
