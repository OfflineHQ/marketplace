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
import { OutlineUserCircle } from '@ui/icons';
import { truncateEmailString, truncateString } from '@utils';

export interface ProfileNavProps
  extends Omit<ProfileAvatarProps, 'user'>,
    DropdownMenuItemsProps {
  user?: ProfileAvatarProps['user'];
  signInTxt?: React.ReactNode;
}

export function ProfileNav({
  user,
  items,
  signInTxt,
  ...props
}: ProfileNavProps) {
  const email = user?.email || '';
  const eoa = user?.eoa || '';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-fit py-0 md:h-12" {...props}>
          {user ? (
            <>
              <ProfileAvatar user={user} />
              <span className="hidden pl-2 md:flex">
                {email
                  ? truncateEmailString(email, 12)
                  : truncateString(eoa, 16)}
              </span>
            </>
          ) : (
            <div className="flex flex-col items-center md:flex-row md:space-x-2">
              <OutlineUserCircle size="lg" />
              <div>{signInTxt}</div>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
}

export default ProfileNav;
