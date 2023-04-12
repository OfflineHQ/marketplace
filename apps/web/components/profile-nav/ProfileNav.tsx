import { ProfileAvatarProps, ProfileAvatar } from '../profile-avatar/ProfileAvatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  Button,
} from '@ui/components';
import { truncateEmailString, truncateString } from '@utils';

export interface ProfileNavProps extends ProfileAvatarProps, DropdownMenuItemsProps {}

export function ProfileNav({ session, items }: ProfileNavProps) {
  const {
    address,
    user: { email },
  } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-1">
          <ProfileAvatar session={session} />
          <span className="hidden pl-2 md:flex">
            {email ? truncateEmailString(email, 12) : truncateString(address, 12)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
}

export default ProfileNav;
