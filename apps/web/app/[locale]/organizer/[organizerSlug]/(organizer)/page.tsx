import { OrganizerSection } from '@feature/organizer/organizer-ui';
import { getOrganizer } from '@features/organizer/organizer-api';

interface OrganizerPageProps {
  params: {
    organizerSlug: string;
    locale: string;
  };
}
export default async function OrganizerPage({
  params: { organizerSlug, locale },
}: OrganizerPageProps) {
  const organizer = await getOrganizer({ slug: organizerSlug, locale });
  return organizer ? <OrganizerSection {...organizer} /> : null;
}
