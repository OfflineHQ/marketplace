import { OrganizerDashboard } from '@features/back-office/dashboard';
import { getEventsFromOrganizerId } from '@features/back-office/dashboard-api';
import { getCurrentUser } from '@next/next-auth/user';

interface DashboardProps {
  params: {
    locale: string;
  };
}

export default async function Dashboard({
  params: { locale },
}: DashboardProps) {
  const user = await getCurrentUser();
  if (!user) return;
  const organizerId = user.role?.organizerId || '';
  if (!organizerId) return;
  const events = await getEventsFromOrganizerId({
    id: organizerId as string,
    locale,
  });
  return <OrganizerDashboard events={events} organizerId={organizerId} />;
}
