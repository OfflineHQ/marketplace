import { getUpcomingEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { UserPassList } from '@features/pass/server';
import {
  revealPass,
  downloadPass,
  batchDownloadOrReveal,
} from '@features/pass-actions';
interface PassTabUpcomingProps {
  params: {
    locale: Locale;
  };
}

export default async function PassTabUpcoming({
  params: { locale },
}: PassTabUpcomingProps) {
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
