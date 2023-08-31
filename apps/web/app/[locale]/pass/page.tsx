import { getUpcomingEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { UserPassList } from '@features/pass/server';
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
  return (
    <UserPassList
      eventsParameters={events}
      noPassImage="./empty-pass.svg"
      passActions={() => []}
    />
  );
}
