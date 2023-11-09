import type { RoleWithOrganizer } from '@roles/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from '@ui/components';
import { getInitials } from '@ui/shared';

export interface RoleAvatarProps extends Omit<AvatarProps, 'size'> {
  role: RoleWithOrganizer;
}

export function RoleAvatar(props: RoleAvatarProps) {
  const {
    role: { organizer },
    className,
  } = props;
  const fallBack = organizer?.name ? getInitials(organizer.name) : '';
  const profileImage = organizer?.image?.url || '';
  return profileImage || fallBack ? (
    <Avatar {...props} className={`${className} h-12 w-12`}>
      <AvatarImage
        src={profileImage || ''}
        className="flex items-center justify-center bg-muted"
      />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  ) : null;
}
