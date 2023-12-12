import { backOfficeAccounts } from '@test-utils/gql';
import { RoleAvatar, RoleAvatarProps } from './RoleAvatar';

export const organizerRoleAdmin = {
  ...backOfficeAccounts.beta_organizer_admin_user.role,
  organizer: {
    image: {
      url: 'https://robohash.org/organizer.png?size=96x96',
    },
    name: 'Organizer Name',
    slug: 'organizer-name',
  },
} as RoleAvatarProps['role'];

export const organizerRoleSuperAdmin = {
  ...organizerRoleAdmin,
  ...backOfficeAccounts.alpha_organizer_super_admin_user.role,
} as RoleAvatarProps['role'];

export const organizerRoleWithoutImage = {
  ...organizerRoleAdmin,
  organizer: {
    ...organizerRoleAdmin.organizer,
    image: {},
  },
} as RoleAvatarProps['role'];

export function RoleAvatarExample(props: RoleAvatarProps) {
  return <RoleAvatar {...props} />;
}
