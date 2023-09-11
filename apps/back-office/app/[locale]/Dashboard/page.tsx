import { OrganizerDashboard } from '@features/back-office/dashboard';
import { getCurrentUser } from '@next/next-auth/user';
import { getEventsFromOrganizerId } from '@features/back-office/dashboard-api';

interface DashboardProps {
  params: {
    locale: string;
  };
}

export default async function Dashboard({
  params: { locale },
}: DashboardProps) {
  const user = await getCurrentUser();
  const organizerId = user?.organizerId || '';
  const events = await getEventsFromOrganizerId({
    id: user?.organizerId as string,
    locale,
  });
  return <OrganizerDashboard events={events} organizerId={organizerId} />;
}
