import { getCurrentUser } from '@web/lib/session';
import { ProfileNavClient } from '../../../components/ProfileNavClient/ProfileNavClient';
import { OrganizerDashboard } from '@features/organizer/dashboard';

export async function Dashboard() {
  const user = await getCurrentUser();

  return (
    <>
      <ProfileNavClient> </ProfileNavClient>
      {user ? (
        <div>
          {user.organizerId ? (
            <OrganizerDashboard user={user} />
          ) : (
            <p>User {user.id} is not an organizer</p>
          )}
        </div>
      ) : (
        <div>Not connected</div>
      )}
    </>
  );
}
