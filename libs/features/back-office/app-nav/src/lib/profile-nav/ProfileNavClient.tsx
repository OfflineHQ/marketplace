'use client';

import { useAuthContext } from '@next/auth';
import { Link } from '@next/navigation';
import { Role } from '@roles/types';
import { useToast } from '@ui/components';
import { LifeBuoy, LogIn, LogOut, Settings } from '@ui/icons';
import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';
import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from './ProfileNav';

export interface ProfileNavClientProps {
  signInText: string;
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
  };
  isNextAuthConnected?: boolean;
}

export const ProfileNavClient = ({
  signInText,
  profileSectionsText,
  isNextAuthConnected,
}: ProfileNavClientProps) => {
  const { safeUser, login, logout, safeAuth, connecting } = useAuthContext();
  const { update } = useSession();
  const { toast } = useToast();

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

  const items: ProfileNavProps['items'] = useMemo(
    () =>
      !safeUser
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
            {
              type: 'label',
              text: profileSectionsText.myAccount,
              className: 'pt-2 pb-0',
            },
            {
              type: 'children',
              children: (
                <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
                  {safeUser.name || safeUser.eoa}
                </div>
              ),
            },
            { type: 'separator' },
            ...commonSections,
            { type: 'separator' },
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: profileSectionsText.signOut,
            },
          ],
    [safeUser, signOutUserAction, login, profileSectionsText],
  );
  return !safeAuth ? (
    <ProfileNavSkeleton />
  ) : (
    <ProfileNav
      items={items}
      isLoading={connecting && !isNextAuthConnected}
      user={safeUser}
      signInText={signInText}
    />
  );
};
