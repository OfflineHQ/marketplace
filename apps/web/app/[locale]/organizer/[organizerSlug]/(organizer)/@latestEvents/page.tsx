import { OrganizerEventsSection } from '@feature/organizer/organizer-ui';
import { getOrganizerLatestEvents } from '@features/organizer/organizer-api';

interface OrganizerLatestEventsPageProps {
  params: {
    organizerSlug: string;
    locale: string;
  };
}

export default async function OrganizerLatestEventsPage({
  params: { organizerSlug, locale },
}: OrganizerLatestEventsPageProps) {
  const latestEvents = await getOrganizerLatestEvents({
    slug: organizerSlug,
    locale,
  });
  return latestEvents ? (
    <OrganizerEventsSection slug={organizerSlug} latestEvents={latestEvents} />
  ) : null;
}
