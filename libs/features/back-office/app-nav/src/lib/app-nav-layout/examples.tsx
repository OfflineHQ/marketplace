import { ProfileNav, ProfileNavSkeleton } from '../profile-nav/ProfileNav';
import { user } from '../profile-nav/examples';
import { organizerRoleAdmin } from '../role-avatar/examples';

export const ProfileNavWithNoUser = () => (
  <ProfileNav
    user={undefined}
    isLoading={false}
    items={[]}
    signInText="Sign in"
  />
);

export const ProfileNavLoading = () => <ProfileNavSkeleton />;

export const ProfileNavWithNoUserLoading = () => (
  <ProfileNav
    user={undefined}
    items={[]}
    isLoading={true}
    signInText="Sign in"
  />
);

export const ProfileNavWithUser = () => (
  <ProfileNav user={user} items={[]} isLoading={false} />
);

export const ProfileNavWithAdminRole = () => (
  <ProfileNav role={organizerRoleAdmin} isLoading={false} items={[]} />
);
