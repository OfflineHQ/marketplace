import { getEventsFromOrganizerId } from '@features/organizer/event/server';
import { defaultLocale } from '@next/i18n';
import { User } from 'next-auth/core/types';
import { EventCards } from './EventCard';

interface OrganizerDashboardProps {
  user: User;
}

export async function OrganizerDashboard(props: OrganizerDashboardProps) {
  const user = props.user;
  const organizerId = user.organizerId;

  const events = (
    await getEventsFromOrganizerId({
      id: organizerId,
      locale: defaultLocale,
    })
  ).map((event) => ({
    ...event,
    eventPasses: event.eventPasses.map((pass) => ({
      ...pass,
      eventPassPricing: pass.eventPassPricing || undefined,
    })),
  }));

  return events && events.length > 0 ? (
    <EventCards events={events} />
  ) : (
    <p>No event at the moment for {organizerId}</p>
  );
}
