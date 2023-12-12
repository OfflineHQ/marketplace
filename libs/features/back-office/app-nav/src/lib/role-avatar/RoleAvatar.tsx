import type { RoleWithOrganizer } from '@roles/types';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarProps,
} from '@ui/components';
import { getInitials } from '@ui/shared';

export interface RoleAvatarProps extends Omit<AvatarProps, 'size' | 'role'> {
  role: RoleWithOrganizer;
}

export function RoleAvatar({
  role: { organizer },
  className,
  ...props
}: RoleAvatarProps) {
  const fallBack = organizer?.name ? getInitials(organizer.name) : '';
  const profileImage = organizer?.image?.url || '';
  return profileImage || fallBack ? (
    <Avatar {...props} className={`${className} h-12 w-12`}>
      <AvatarImage
        src={profileImage || ''}
        className={`flex items-center justify-center bg-muted ${organizer?.imageClasses}`}
      />
      <AvatarFallback>{fallBack}</AvatarFallback>
    </Avatar>
  ) : null;
}
