import {
  AutoAnimate,
  AvatarSkeleton,
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
  Spinner,
  TextSkeleton,
} from '@ui/components';
import { OutlineUserCircle } from '@ui/icons';
import { truncateEmailString } from '@utils';
import {
  ProfileAvatar,
  ProfileAvatarProps,
} from '../profile-avatar/ProfileAvatar';

export interface ProfileNavProps
  extends Omit<ProfileAvatarProps, 'user' | 'size'>,
    DropdownMenuItemsProps {
  user?: ProfileAvatarProps['user'];
  signInText?: React.ReactNode;
  accountPlaceholder?: React.ReactNode;
  isLoading?: boolean;
}

export function ProfileNav({
  user,
  items,
  signInText,
  isLoading,
  accountPlaceholder,
  ...props
}: ProfileNavProps) {
  const email = user?.email || '';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          {...props}
          className="inline-flex h-16 w-fit p-0 md:h-12"
        >
          {user ? (
            <div className="flex size-16 flex-col items-center justify-center space-y-1 px-1 md:w-fit md:flex-row md:space-x-2 md:space-y-0 md:px-4">
              <AutoAnimate>
                {isLoading ? (
                  <Spinner size="xl" variant="ghost" className="md:mr-2" />
                ) : (
                  <ProfileAvatar user={user} />
                )}
              </AutoAnimate>
              <div className="hidden pb-1 font-medium md:flex md:pb-0">
                {email ? truncateEmailString(email, 12) : accountPlaceholder}
              </div>
            </div>
          ) : (
            <div className="mt-3 flex h-16 flex-col items-center space-y-0 px-4 md:mt-0 md:flex-row md:space-x-2">
              <AutoAnimate className="h-[36px] md:h-auto">
                {isLoading ? (
                  <Spinner size="xl" variant="ghost" className="md:mr-2" />
                ) : (
                  <OutlineUserCircle size="xl" />
                )}
              </AutoAnimate>
              {/* <QrCode size="lg" /> */}
              <div className="pb-1 font-semibold md:pb-0">{signInText}</div>
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
      <AvatarSkeleton className="size-12 md:mx-5" />
      <TextSkeleton className="mr-5 hidden md:flex" />
    </div>
  );
}
