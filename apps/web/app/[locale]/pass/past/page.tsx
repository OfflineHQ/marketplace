import { getPassedEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { UserPassList } from '@features/pass/server';
import { useTranslations } from 'next-intl';

interface PassTabsPastProps {
  params: {
    locale: Locale;
  };
}

function PassTabContent({
  events,
}: Awaited<ReturnType<typeof getPassedEventsWithEventPassNfts>> | null) {
  const actionsFunctions = {
    downloadPass: () => null,
    revealPass: () => null,
    sendPass: () => null,
  };
  return (
    <UserPassList
      eventsParameters={events}
      noPassImage="/empty-pass.svg"
      actionsFunctions={actionsFunctions}
    />
  );
}

export default async function PassTabPast({
  params: { locale },
}: PassTabsPastProps) {
  const user = await getCurrentUser();
  let events: Awaited<
    ReturnType<typeof getPassedEventsWithEventPassNfts>
  > | null = null;
  if (!user) {
    return null;
  }
  events = await getPassedEventsWithEventPassNfts({
    locale,
    currentDate: new Date().toUTCString(),
  });
  return <PassTabContent events={events} />;
}
