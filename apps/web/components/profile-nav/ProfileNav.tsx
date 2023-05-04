import {
  ProfileAvatarProps,
  ProfileAvatar,
} from '../profile-avatar/ProfileAvatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  Button,
} from '@ui/components';
import { truncateEmailString, truncateString } from '@utils';

export interface ProfileNavProps
  extends ProfileAvatarProps,
    DropdownMenuItemsProps {}

export function ProfileNav({ user, items, ...props }: ProfileNavProps) {
  const { email, eoa } = user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-1" {...props}>
          <ProfileAvatar user={user} />
          <span className="hidden pl-2 md:flex">
            {email ? truncateEmailString(email, 12) : truncateString(eoa, 16)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
}

export default ProfileNav;
