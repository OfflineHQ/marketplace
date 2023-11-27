import { batchDownloadOrReveal, revealPass } from '@features/pass-actions';
import { getPassedEventsWithEventPassNfts } from '@features/pass-api';
import { UserPassList } from '@features/pass/server';
import type { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';

interface PassTabsPastProps {
  params: {
    locale: Locale;
  };
}

export default async function PassTabPast({
  params: { locale },
}: PassTabsPastProps) {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const events = await getPassedEventsWithEventPassNfts({
    locale,
    currentDate: new Date().toUTCString(),
  });
  const actionsFunctions = {
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
