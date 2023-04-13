import { ProfileAvatarProps, ProfileAvatar } from '../profile-avatar/ProfileAvatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  NavigationMenu,
  Button,
  NavigationMenuList,
} from '@ui/components';
import { truncateEmailString, truncateString } from '@utils';

export interface ProfileNavProps extends ProfileAvatarProps, DropdownMenuItemsProps {}

export function ProfileNav({ session, items, ...props }: ProfileNavProps) {
  const {
    address,
    user: { email },
  } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="py-1" {...props}>
          <ProfileAvatar session={session} />
          <span className="hidden pl-2 md:flex">
            {email ? truncateEmailString(email, 12) : truncateString(address, 16)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <NavigationMenu>
        <NavigationMenuList>
          <DropdownMenuItems items={items} />
        </NavigationMenuList>
      </NavigationMenu>
    </DropdownMenu>
  );
}

export default ProfileNav;
