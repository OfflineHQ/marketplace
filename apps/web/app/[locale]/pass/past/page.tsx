import { getPassedEventsWithEventPassNfts } from '@features/pass-api';
import type { Locale } from '@gql/shared/types';
import { getCurrentUser } from '@next/next-auth/user';
import { UserPassList } from '@features/pass/server';

interface PassTabsPastProps {
  params: {
    locale: Locale;
  };
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
  return (
    <UserPassList
      eventsParameters={events}
      noPassImage="./empty-pass.svg"
      passActions={() => []}
    />
  );
}
