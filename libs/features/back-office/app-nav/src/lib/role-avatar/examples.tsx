import { Roles_Enum } from '@gql/shared/types';
import { RoleAvatar, RoleAvatarProps } from './RoleAvatar';

export const organizerRoleAdmin = {
  role: Roles_Enum.OrganizerAdmin,
  organizerId: '123',
  organizer: {
    image: {
      url: 'https://robohash.org/organizer.png?size=96x96',
    },
    name: 'Organizer Name',
    slug: 'organizer-name',
  },
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
