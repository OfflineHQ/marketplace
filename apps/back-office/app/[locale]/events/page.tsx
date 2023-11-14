import { OrganizerEvents } from '@features/back-office/events';
import { getEventsFromOrganizerId } from '@features/back-office/events-api';
import { getCurrentUser } from '@next/next-auth/user';

interface EventsProps {
  params: {
    locale: string;
  };
}

export default async function Events({ params: { locale } }: EventsProps) {
  const user = await getCurrentUser();
  if (!user) return;
  const organizerId = user.role?.organizerId || '';
  if (!organizerId) return;
  const events = await getEventsFromOrganizerId({
    id: organizerId as string,
    locale,
  });
  return <OrganizerEvents events={events} organizerId={organizerId} />;
}
