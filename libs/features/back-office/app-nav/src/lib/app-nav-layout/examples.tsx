import { backOfficeAccounts } from '@test-utils/gql';
import { MenuNav } from '../menu-nav/MenuNav';
import { ProfileNav, ProfileNavSkeleton } from '../profile-nav/ProfileNav';
import {
  itemsAdmin,
  itemsNotConnected,
  itemsSuperAdmin,
  itemsUserNoRoles,
  user,
} from '../profile-nav/examples';
import {
  organizerRoleAdmin,
  organizerRoleSuperAdmin,
} from '../role-avatar/examples';

export const ProfileNavWithNoUser = () => (
  <ProfileNav
    user={undefined}
    isLoading={false}
    items={itemsNotConnected}
    signInText="Sign in"
  />
);

export const ProfileNavLoading = () => <ProfileNavSkeleton />;

export const ProfileNavWithNoUserLoading = () => (
  <ProfileNav
    user={undefined}
    items={itemsNotConnected}
    isLoading={true}
    signInText="Sign in"
  />
);

export const ProfileNavWithUser = () => (
  <ProfileNav user={user} items={itemsUserNoRoles} isLoading={false} />
);

export const ProfileNavWithUserLoading = () => (
  <ProfileNav user={user} items={itemsUserNoRoles} isLoading={true} />
);

export const ProfileNavWithAdminRole = () => (
  <ProfileNav role={organizerRoleAdmin} isLoading={false} items={itemsAdmin} />
);

export const ProfileNavWithSuperAdminRole = () => (
  <ProfileNav
    role={organizerRoleSuperAdmin}
    isLoading={false}
    items={itemsSuperAdmin}
  />
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
