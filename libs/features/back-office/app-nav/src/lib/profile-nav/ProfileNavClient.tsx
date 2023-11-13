'use client';

import { RoleBadge } from '@features/back-office/roles';
import { SafeUser, useAuthContext } from '@next/auth';
import { Link } from '@next/navigation';
import { AppUser } from '@next/types';
import { Role, RoleWithOrganizer } from '@roles/types';
import { BlockchainAddress, DropdownMenuItem, useToast } from '@ui/components';
import { LifeBuoy, LogIn, LogOut, Settings } from '@ui/icons';
import { toast } from 'libs/ui/components/src/lib/toast/useToast';
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
  console.log({ role });
  return (
    <DropdownMenuItem
      onSelect={() => switchToRole(role)}
      className="cursor-pointer"
    >
      <div className="flex w-fit flex-row items-center justify-center space-x-2 space-y-0 px-4">
        <RoleAvatar role={role} />
        <div className="hidden flex-col md:flex">
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

  const rolesSections: ProfileNavProps['items'] = roles?.length
    ? [
        { type: 'separator' },
        {
          type: 'label',
          text: 'Roles',
          className: 'pt-2 pb-0',
        },
        {
          type: 'sub',
          text: 'Switch to role',
          subItems: roles.map((role) => ({
            type: 'children',
            children: <RoleItem role={role} switchToRole={switchToRole} />,
            className: 'cursor-pointer',
          })),
        },
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
