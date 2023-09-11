import { getEventsFromOrganizerId } from '@features/back-office/dashboard-api';
import { defaultLocale } from '@next/i18n';
import { User } from 'next-auth/core/types';
import { EventCards } from './EventCards';
import { Uploader } from 'uploader';
import { getNextAppURL } from '@utils';

interface OrganizerDashboardProps {
  user: User;
}

export async function OrganizerDashboard(props: OrganizerDashboardProps) {
  const user = props.user;
  const organizerId = user.organizerId;

  const events = await getEventsFromOrganizerId({
    id: organizerId as string,
    locale: defaultLocale,
  });

  const uploader = Uploader({
    apiKey: (process.env.UPLOAD_PUBLIC_API_KEY ||
      process.env.NEXT_PUBLIC_UPLOAD_PUBLIC_API_KEY) as string,
  });

  uploader.beginAuthSession(`${getNextAppURL()}/api/jwt)`, () =>
    Promise.resolve({})
  );

  return events && events.length > 0 ? (
    <EventCards
      events={events}
      organizerId={organizerId as string}
      uploader={uploader}
    />
  ) : (
    <p>No event at the moment for {organizerId}</p>
  );
}
