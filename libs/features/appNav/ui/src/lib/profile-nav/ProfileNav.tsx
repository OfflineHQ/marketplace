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
  AvatarSkeleton,
  TextSkeleton,
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
        <Button
          variant="ghost"
          className="mt-1 h-16 p-0 px-4 md:h-12 md:py-2"
          {...props}
        >
          {user ? (
            <div className="flex flex-col items-center space-y-1 pb-0 md:flex-row md:space-x-2">
              <ProfileAvatar user={user} />
              <span className="hidden pl-2 md:flex">
                {email
                  ? truncateEmailString(email, 12)
                  : truncateString(eoa, 16)}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-1 pb-0 md:flex-row md:space-x-2">
              <OutlineUserCircle size="xl" />
              <div className="font-semibold">{signInTxt}</div>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
}

export function ProfileNavSkeleton() {
  return (
    <div className="flex items-center opacity-100">
      <AvatarSkeleton className="mx-5 mr-7 h-12 w-12 md:mr-2" />
      <TextSkeleton className="mr-5 hidden md:flex" />
    </div>
  );
}

export default ProfileNav;
