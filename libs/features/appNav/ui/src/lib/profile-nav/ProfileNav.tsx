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
  NavigationMenuItem,
  NavigationMenuLink,
} from '@ui/components';
import { OutlineUserCircle, QrCode } from '@ui/icons';
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
          {...props}
          className="inline-flex h-16 w-fit p-0 md:h-12"
        >
          {user ? (
            <div className="flex h-16 w-16 flex-col items-center justify-center space-y-1 px-1 md:w-fit md:flex-row md:space-x-2 md:px-4">
              <ProfileAvatar user={user} className="relative bottom-10" />
              <span className="hidden pl-2 md:flex">
                {email
                  ? truncateEmailString(email, 12)
                  : truncateString(eoa, 16)}
              </span>
            </div>
          ) : (
            <div className="mt-3 flex h-16 flex-col items-center space-y-0 px-4 md:mt-0 md:flex-row md:space-x-2">
              <OutlineUserCircle size="xl" />
              {/* <QrCode size="lg" /> */}
              <div className="pb-1 font-semibold md:pb-0">{signInTxt}</div>
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
    <div className="relative inline-block items-center justify-center opacity-100 md:flex">
      <AvatarSkeleton className="h-12 w-12 md:mx-5" />
      <TextSkeleton className="mr-5 hidden md:flex" />
    </div>
  );
}

export default ProfileNav;
