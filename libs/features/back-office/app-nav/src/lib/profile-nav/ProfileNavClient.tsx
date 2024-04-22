'use client';

import { RoleBadge } from '@features/back-office/roles';
import { useAuthContext } from '@next/auth';
import { Link, useRouter } from '@next/navigation';
import { AppUser } from '@next/types';
import { isSameRole } from '@roles/common';
import { RoleWithOrganizer } from '@roles/types';
import { BlockchainAddress, DropdownMenuItem, useToast } from '@ui/components';
import {
  LifeBuoy,
  LogIn,
  LogOut,
  Settings,
  SignUp,
  User,
  VerifyEmail,
} from '@ui/icons';
import { getErrorMessage } from '@utils';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';
import { RoleAvatar } from '../role-avatar/RoleAvatar';
import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from './ProfileNav';

const VerifyEmailDynamic = dynamic(
  async () => (await import('@features/kyc')).SumsubDialog,
  { ssr: false },
);

interface ConstructItemsParams {
  roles?: RoleWithOrganizer[];
  matchingRole?: RoleWithOrganizer;
  user: AppUser | undefined;
  profileSectionsText: {
    myAccount: string;
    support: string;
    supportTitle: string;
    supportDescription: string;
    signOut: string;
    signOutTitle: string;
    signOutDescription: string;
    createAccount: string;
    createAccountTitle: string;
    createAccountDescription: string;
    dontHaveAnAccount: string;
    signIn: string;
    settings: string;
    copiedAddress: string;
    switchToMyAccount: string;
    myCurrentRole: string;
    switchToRole: string;
    switchToRoleToastTitle: string;
    switchToRoleToastErrorTitle: string;
    switchToMyAccountToastTitle: string;
    switchToMyAccountToastTDescription: string;
    switchToMyAccountToastErrorTitle: string;
    verifyEmail: string;
    verifyEmailContinue: string;
  };
  login: () => void;
  signOutUserAction: () => void;
  createAccountAction: () => void;
  switchToRole: (role: RoleWithOrganizer) => void;
  switchToMyAccount: () => void;
  verifyEmail: () => void;
  toast: ReturnType<typeof useToast>['toast'];
}

export interface ProfileNavClientProps
  extends Pick<ConstructItemsParams, 'roles' | 'profileSectionsText'> {
  signInText: string;
  isNextAuthConnected?: boolean;
  account?: AppUser;
}

interface RoleItemProps {
  role: RoleWithOrganizer;
  switchToRole: (role: RoleWithOrganizer) => void;
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
          <div className="pb-1 font-medium">{name}</div>
          <RoleBadge role={role} size="sm" />
        </div>
      </div>
    </DropdownMenuItem>
  );
};

const RoleItemDisplay = ({ role }: { role: RoleWithOrganizer }) => (
  <div className="flex w-fit flex-row items-center justify-center space-x-2 space-y-0 pl-2">
    <RoleAvatar role={role} />
    <div className="flex flex-col">
      <div className="pb-1 text-sm font-medium">{role.organizer?.name}</div>
      <RoleBadge role={role} size="sm" />
    </div>
  </div>
);

export const constructItems = ({
  roles,
  matchingRole,
  user,
  profileSectionsText,
  login,
  signOutUserAction,
  createAccountAction,
  switchToRole,
  switchToMyAccount,
  verifyEmail,
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
          text: profileSectionsText.myCurrentRole,
          className: 'md:hidden',
        },
        {
          type: 'children',
          children: <RoleItemDisplay role={matchingRole} />,
          className: 'md:hidden',
        },
        {
          type: 'separator',
          className: 'md:hidden',
        },
      ]
    : [];

  const userInfoSections: ProfileNavProps['items'] = user
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
                address={user.address}
                copiedText={profileSectionsText.copiedAddress}
              />
            </div>
          ),
        },
        user.email
          ? {
              type: 'children',
              children: (
                <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
                  {user.email}
                </div>
              ),
            }
          : {
              type: 'item',
              icon: <VerifyEmail />,
              className: 'cursor-pointer font-semibold',
              action: verifyEmail,
              text: profileSectionsText.verifyEmail,
            },
      ]
    : [];
  if (matchingRole) {
    userInfoSections.push({
      type: 'item',
      text: profileSectionsText.switchToMyAccount,
      icon: <User />,
      className: 'cursor-pointer',
      action: switchToMyAccount,
    });
  }

  const notMachingRoleSections: ProfileNavProps['items'] = roles?.length
    ? [
        ...roles
          .filter((role) => role !== matchingRole)
          .map(
            (role) =>
              ({
                type: 'children',
                children: <RoleItem role={role} switchToRole={switchToRole} />,
                className: 'cursor-pointer',
              }) as ProfileNavProps['items'][0],
          ),
      ]
    : [];

  const rolesSections: ProfileNavProps['items'] = notMachingRoleSections?.length
    ? [
        { type: 'separator' },
        {
          type: 'label',
          text: profileSectionsText.switchToRole,
          className: 'pt-2 pb-0',
        },
        ...notMachingRoleSections,
      ]
    : [];

  return !user
    ? [
        {
          type: 'item',
          icon: <LogIn />,
          className: 'cursor-pointer font-semibold',
          action: login,
          text: profileSectionsText.signIn,
        },
        { type: 'separator' },
        {
          type: 'label',
          className: 'font-normal text-xs',
          text: profileSectionsText.dontHaveAnAccount,
        },
        {
          type: 'item',
          icon: <SignUp />,
          className: 'cursor-pointer',
          action: createAccountAction,
          text: profileSectionsText.createAccount,
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
  const { login, logout, createAccount, connecting } = useAuthContext();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const { update } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const matchingRole = account?.role
    ? roles?.find((role) => {
        const userRole = account.role;
        return isSameRole({ role, roleToCompare: userRole });
      })
    : undefined;

  const signOutUserAction = useCallback(async () => {
    router.push('/');
    await logout({ refresh: true });
    toast({
      title: profileSectionsText.signOutTitle,
      description: profileSectionsText.signOutDescription,
    });
  }, [logout, toast, profileSectionsText]);

  const createAccountAction = useCallback(async () => {
    await createAccount();
    toast({
      title: profileSectionsText.createAccountTitle,
      description: profileSectionsText.createAccountDescription,
    });
  }, [createAccount, toast, profileSectionsText]);

  const switchToRole = useCallback(
    async (role: RoleWithOrganizer) => {
      try {
        const session = await update({ role });
        toast({
          title: profileSectionsText.switchToRoleToastTitle,
          description: <RoleItemDisplay role={role} />,
        });
        // TODO redirect to default role route
        // const defaultRoleRoute = '';
        router.refresh();
      } catch (error) {
        console.error(error);
        toast({
          title: profileSectionsText.switchToRoleToastErrorTitle,
          description: getErrorMessage(error),
          variant: 'destructive',
        });
      }
    },
    [update, toast, profileSectionsText],
  );

  const switchToMyAccount = useCallback(async () => {
    try {
      await update();
      toast({
        title: profileSectionsText.switchToMyAccountToastTitle,
        description: profileSectionsText.switchToMyAccountToastTDescription,
      });
      router.push('/my-roles');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: profileSectionsText.switchToMyAccountToastErrorTitle,
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }, [update, toast, profileSectionsText]);

  const items: ProfileNavProps['items'] = useMemo(
    () =>
      constructItems({
        roles,
        matchingRole,
        profileSectionsText,
        login,
        user: account,
        signOutUserAction,
        createAccountAction,
        switchToRole,
        switchToMyAccount,
        toast,
        verifyEmail: () => setIsVerifyEmail(true),
      }),
    [
      roles,
      matchingRole,
      profileSectionsText,
      login,
      signOutUserAction,
      switchToRole,
      switchToMyAccount,
      toast,
      account,
      createAccountAction,
    ],
  );
  return connecting ? (
    <ProfileNavSkeleton />
  ) : (
    <>
      <ProfileNav
        items={items}
        isLoading={connecting && !isNextAuthConnected}
        user={account}
        role={matchingRole}
        signInText={signInText}
      />
      {isVerifyEmail && (
        <VerifyEmailDynamic
          open={isVerifyEmail}
          confirmedText={profileSectionsText.verifyEmailContinue}
          onOpenChange={setIsVerifyEmail}
          title={profileSectionsText.verifyEmail}
        />
      )}
    </>
  );
};
