import { RoleAvatarProps, RoleAvatar } from './RoleAvatar';
import { Roles_Enum } from '@gql/shared/types';

export const organizerRole = {
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
  ...organizerRole,
  organizer: {
    ...organizerRole.organizer,
    image: null,
  },
} as RoleAvatarProps['role'];

export function RoleAvatarExample(props: RoleAvatarProps) {
  return <RoleAvatar {...props} />;
}
