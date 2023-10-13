import {
  batchDownloadOrReveal,
  downloadPass,
  revealPass,
} from '@features/pass-actions';
import { getUpcomingEventsWithEventPassNfts } from '@features/pass-api';
import { UserPassList } from '@features/pass/server';
import type { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
interface PassTabUpcomingProps {
  params: {
    locale: Locale;
  };
}

export default async function PassTabUpcoming({
  params: { locale },
}: PassTabUpcomingProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const events = await getUpcomingEventsWithEventPassNfts({
    locale,
    currentDate: new Date().toUTCString(),
  });
  const actionsFunctions = {
    downloadPass,
    revealPass,
  };
  return (
    <UserPassList
      eventsParameters={events}
      actionsFunctions={actionsFunctions}
      batchDownloadOrReveal={batchDownloadOrReveal}
      noPassImage="/empty-pass.svg"
    />
  );
}
