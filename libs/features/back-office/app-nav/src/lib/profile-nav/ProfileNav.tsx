import { ProfileAvatar, ProfileAvatarProps } from '@features/app-nav';
import { RoleBadge } from '@features/back-office/roles';
import { RoleWithOrganizer } from '@roles/types';
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
import { truncateEmailString, truncateString } from '@utils';
import { RoleAvatar } from '../role-avatar/RoleAvatar';

export interface ProfileNavProps
  extends Omit<ProfileNavUserProps, 'user'>,
    Omit<ProfileNavRoleProps, 'role'>,
    ProfileNavNotConnectedProps,
    DropdownMenuItemsProps {
  user?: ProfileNavUserProps['user'];
  role?: ProfileNavRoleProps['role'];
}

export function ProfileNav({
  user,
  role,
  items,
  signInText,
  isLoading,
  ...props
}: ProfileNavProps) {
  function ProfileNavContent() {
    if (role) return <ProfileNavRole role={role} isLoading={isLoading} />;
    else if (user) return <ProfileNavUser user={user} isLoading={isLoading} />;
    return (
      <ProfileNavNotConnected signInText={signInText} isLoading={isLoading} />
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          {...props}
          className="inline-flex h-16 w-fit p-0 md:h-12"
        >
          <ProfileNavContent />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  );
}

interface ProfileNavUserProps
  extends Omit<ProfileAvatarProps, 'user' | 'role'> {
  user: ProfileAvatarProps['user'];
  isLoading: boolean;
}

function ProfileNavUser({ user, isLoading }: ProfileNavUserProps) {
  const email = user?.email || '';
  const eoa = user?.eoa || '';
  return (
    <div className="flex w-fit flex-row  items-center justify-center space-x-2 space-y-0 px-4">
      <AutoAnimate>
        {isLoading ? (
          <Spinner size="xl" variant="ghost" className="md:mr-2" />
        ) : (
          <ProfileAvatar user={user} />
        )}
      </AutoAnimate>
      <div className="hidden pb-0 font-semibold md:flex">
        {email ? truncateEmailString(email, 12) : truncateString(eoa, 16)}
      </div>
    </div>
  );
}

interface ProfileNavNotConnectedProps {
  isLoading: boolean;
  signInText?: React.ReactNode;
}

function ProfileNavNotConnected({
  signInText,
  isLoading,
}: ProfileNavNotConnectedProps) {
  return (
    <div className="mt-3 flex h-16 flex-col items-center space-y-0 px-4 md:mt-0 md:flex-row md:space-x-2">
      <AutoAnimate>
        {isLoading ? (
          <Spinner size="xl" variant="ghost" className="md:mr-2" />
        ) : (
          <OutlineUserCircle size="xl" />
        )}
      </AutoAnimate>
      {/* <QrCode size="lg" /> */}
      <div className="pb-1 font-semibold md:pb-0">{signInText}</div>
    </div>
  );
}

interface ProfileNavRoleProps {
  role: RoleWithOrganizer;
  isLoading: boolean;
}

function ProfileNavRole({ role, isLoading }: ProfileNavRoleProps) {
  const name = role.organizer?.name;
  return (
    <div className="flex w-fit flex-row  items-center justify-center space-x-2 space-y-0 px-4">
      <AutoAnimate>
        {isLoading ? (
          <Spinner size="xl" variant="ghost" className="md:mr-2" />
        ) : (
          <RoleAvatar role={role} />
        )}
      </AutoAnimate>
      <div className="hidden flex-col md:flex">
        <div className="pb-1 font-semibold">{name}</div>
        <RoleBadge role={role} size="sm" />
      </div>
    </div>
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
