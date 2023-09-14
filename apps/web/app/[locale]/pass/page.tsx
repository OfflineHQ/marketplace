import { getUpcomingEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { UserPassList } from '@features/pass/server';
import { revealPass, downloadPass } from '@features/pass-actions';
interface PassTabComingSoonProps {
  params: {
    locale: Locale;
  };
}

export default async function PassTabComingSoon({
  params: { locale },
}: PassTabComingSoonProps) {
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
      noPassImage="/empty-pass.svg"
    />
  );
}
