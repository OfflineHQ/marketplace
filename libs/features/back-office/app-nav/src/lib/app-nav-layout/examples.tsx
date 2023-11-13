import { backOfficeAccounts } from '@test-utils/gql';
import { MenuNav } from '../menu-nav/MenuNav';
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

export const MenuNavWithNoUser = () => <MenuNav user={undefined} />;

export const MenuNavWithNoRole = () => (
  <MenuNav user={backOfficeAccounts.delta_user} />
);

export const MenuNavWithAdminRole = () => (
  <MenuNav user={backOfficeAccounts.beta_organizer_admin_user} />
);

export const MenuNavWithSuperAdminRole = () => (
  <MenuNav user={backOfficeAccounts.alpha_organizer_super_admin_user} />
);
