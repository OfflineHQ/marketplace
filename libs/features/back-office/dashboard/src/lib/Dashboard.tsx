import { getEventsFromOrganizerId } from '@features/back-office/dashboard-api';
import { defaultLocale } from '@next/i18n';
import { User } from 'next-auth/core/types';
import { EventCards } from './EventCards';

interface OrganizerDashboardProps {
  user: User;
  jwt: string;
}

export async function OrganizerDashboard(props: OrganizerDashboardProps) {
  const user = props.user;
  const organizerId = user.organizerId;

  const events = await getEventsFromOrganizerId({
    id: organizerId as string,
    locale: defaultLocale,
  });

  return events && events.length > 0 ? (
    <EventCards events={events} organizerId={organizerId as string} jwt={jwt} />
  ) : (
    <p>No event at the moment for {organizerId}</p>
  );
}
