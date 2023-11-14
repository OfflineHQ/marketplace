'use client';

import { RoleBadge } from '@features/back-office/roles';
import { SafeUser, useAuthContext } from '@next/auth';
import { Link } from '@next/navigation';
import { AppUser } from '@next/types';
import { Role, RoleWithOrganizer } from '@roles/types';
import { BlockchainAddress, DropdownMenuItem, useToast } from '@ui/components';
import { LifeBuoy, LogIn, LogOut, Settings, User } from '@ui/icons';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';
import { RoleAvatar } from '../role-avatar/RoleAvatar';
import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from './ProfileNav';

interface ConstructItemsParams {
  roles?: RoleWithOrganizer[];
  matchingRole?: RoleWithOrganizer;
  safeUser: SafeUser | undefined;
  profileSectionsText: {
    myAccount: string;
    support: string;
    supportTitle: string;
    supportDescription: string;
    signOut: string;
    signOutTitle: string;
    signOutDescription: string;
    signIn: string;
    settings: string;
    copiedAddress: string;
  };
  login: () => void;
  signOutUserAction: () => void;
  switchToRole: (role: Role) => void;
  switchToMyAccount: () => void;
  toast: ReturnType<typeof useToast>['toast'];
}

export interface ProfileNavClientProps
  extends Pick<
    ConstructItemsParams,
    'roles' | 'matchingRole' | 'profileSectionsText'
  > {
  signInText: string;
  isNextAuthConnected?: boolean;
  account?: AppUser;
}

interface RoleItemProps {
  role: RoleWithOrganizer;
  switchToRole: (role: Role) => void;
}

const RoleItem = ({ role, switchToRole }: RoleItemProps) => {
  const name = role.organizer?.name;
  return (
    <DropdownMenuItem
      onSelect={() => switchToRole(role)}
      className="cursor-pointer"
    >
      <div className="mr-2 flex w-fit flex-row items-center justify-center space-x-2 space-y-0">
        <RoleAvatar role={role} />
        <div className="flex flex-col">
          <div className="pb-1 font-semibold">{name}</div>
          <RoleBadge role={role} size="sm" />
        </div>
      </div>
    </DropdownMenuItem>
  );
};

export const constructItems = ({
  roles,
  matchingRole,
  safeUser,
  profileSectionsText,
  login,
  signOutUserAction,
  switchToRole,
  switchToMyAccount,
  toast,
}: ConstructItemsParams): ProfileNavProps['items'] => {
  const commonSections: ProfileNavProps['items'] = [
    {
      type: 'item',
      wrapper: <Link href="/settings" />,
      icon: <Settings />,
      className: 'cursor-pointer',
      text: profileSectionsText.settings,
    },
    {
      type: 'item',
      icon: <LifeBuoy />,
      className: 'cursor-pointer',
      text: profileSectionsText.support,
      action: () =>
        toast({
          title: profileSectionsText.supportTitle,
          description: profileSectionsText.supportDescription,
        }),
    },
  ];

  const currentRoleSections: ProfileNavProps['items'] = matchingRole
    ? [
        {
          type: 'label',
          text: 'My current role',
          className: 'md:hidden',
        },
        {
          type: 'children',
          children: (
            <div className="flex w-fit flex-row items-center justify-center space-x-2 space-y-0 pl-2">
              <RoleAvatar role={matchingRole} />
              <div className="flex flex-col">
                <div className="pb-1 text-sm">
                  {matchingRole.organizer?.name}
                </div>
                <RoleBadge role={matchingRole} size="sm" />
              </div>
            </div>
          ),
          className: 'md:hidden',
        },
        {
          type: 'separator',
          className: 'md:hidden',
        },
      ]
    : [];

  const userInfoSections: ProfileNavProps['items'] = safeUser
    ? [
        {
          type: 'label',
          text: profileSectionsText.myAccount,
          className: 'pt-2 pb-0',
        },
        {
          type: 'children',
          children: (
            <div className="py-1 pl-2">
              <BlockchainAddress
                variant="outline"
                address={safeUser.eoa}
                copiedText={profileSectionsText.copiedAddress}
              />
            </div>
          ),
        },
      ]
    : [];
  if (safeUser?.name) {
    userInfoSections.splice(1, 0, {
      type: 'children',
      children: (
        <div className="overflow-hidden py-1 pl-2 text-sm">{safeUser.name}</div>
      ),
    });
  }
  if (matchingRole) {
    userInfoSections.push({
      type: 'item',
      text: 'Switch to my account',
      icon: <User />,
      className: 'cursor-pointer',
      action: switchToMyAccount,
    });
  }

  const rolesSections: ProfileNavProps['items'] = roles?.length
    ? [
        { type: 'separator' },
        {
          type: 'label',
          text: 'Switch to role',
          className: 'pt-2 pb-0',
        },
        ...(roles
          .filter((role) => role !== matchingRole)
          .map((role) => ({
            type: 'children',
            children: <RoleItem role={role} switchToRole={switchToRole} />,
            className: 'cursor-pointer',
          })) satisfies ProfileNavProps['items']),
      ]
    : [];

  return !safeUser
    ? [
        {
          type: 'item',
          icon: <LogIn />,
          className: 'cursor-pointer font-semibold',
          action: login,
          text: profileSectionsText.signIn,
        },
        { type: 'separator' },
        ...commonSections,
      ]
    : [
        ...currentRoleSections,
        ...userInfoSections,
        ...rolesSections,
        { type: 'separator' },
        ...commonSections,
        {
          type: 'item',
          icon: <LogOut />,
          className: 'cursor-pointer',
          action: signOutUserAction,
          text: profileSectionsText.signOut,
        },
      ];
};

export const ProfileNavClient = ({
  signInText,
  profileSectionsText,
  isNextAuthConnected,
  roles,
  account,
}: ProfileNavClientProps) => {
  const { safeUser, login, logout, safeAuth, connecting } = useAuthContext();
  const { update } = useSession();
  const { toast } = useToast();

  const matchingRole = account?.role
    ? roles?.find((role) => {
        const userRole = account.role;
        return (
          role.role === userRole?.role &&
          role.organizerId === userRole?.organizerId &&
          (role.eventId === userRole?.eventId || !userRole?.eventId)
        );
      })
    : undefined;

  const signOutUserAction = useCallback(async () => {
    await logout({ refresh: true });
    toast({
      title: profileSectionsText.signOutTitle,
      description: profileSectionsText.signOutDescription,
    });
  }, [logout, toast, profileSectionsText]);

  const switchToRole = useCallback(
    async (role: Role) => {
      try {
        await update({ role });
      } catch (error) {
        // TODO handle error with toast
        console.error(error);
      }
    },
    [update],
  );

  const switchToMyAccount = useCallback(async () => {
    await update();
  }, [update]);

  const items: ProfileNavProps['items'] = useMemo(
    () =>
      constructItems({
        roles,
        matchingRole,
        safeUser,
        profileSectionsText,
        login,
        signOutUserAction,
        switchToRole,
        switchToMyAccount,
        toast,
      }),
    [
      roles,
      matchingRole,
      safeUser,
      profileSectionsText,
      login,
      signOutUserAction,
      switchToRole,
      switchToMyAccount,
      toast,
    ],
  );
  return !safeAuth ? (
    <ProfileNavSkeleton />
  ) : (
    <ProfileNav
      items={items}
      isLoading={connecting && !isNextAuthConnected}
      user={safeUser}
      role={matchingRole}
      signInText={signInText}
    />
  );
};
