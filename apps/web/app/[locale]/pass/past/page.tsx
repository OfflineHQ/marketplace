import { getPassedEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { UserPassList } from '@features/pass/server';
import { revealPass, downloadPass } from '@features/pass-actions';

interface PassTabsPastProps {
  params: {
    locale: Locale;
  };
}

export default async function PassTabPast({
  params: { locale },
}: PassTabsPastProps) {
  const events = await getPassedEventsWithEventPassNfts({
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
