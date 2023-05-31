'use client';

import React, { useMemo, useCallback } from 'react';
import { LogIn, Settings, LifeBuoy, LogOut } from '@ui/icons';
import { useToast } from '@ui/components';
import { useAuthContext } from '@client/auth';
import Link from 'next/link';
import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from '@features/appNav/ui';

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
}

export const ProfileNavClient = ({
  signInText,
  profileSectionsText,
}: ProfileNavClientProps) => {
  const { safeUser, login, logout, safeAuth, provider } = useAuthContext();
  const { toast } = useToast();

  const signOutUserAction = useCallback(async () => {
    await logout();
    toast({
      title: profileSectionsText.signOutTitle,
      description: profileSectionsText.signOutDescription,
    });
  }, [logout, toast, profileSectionsText]);

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
            {
              type: 'item',
              wrapper: <Link href="/settings" />,
              icon: <Settings />,
              className: 'cursor-pointer',
              text: profileSectionsText.settings,
            },
            { type: 'separator' },
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
            { type: 'separator' },
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: profileSectionsText.signOut,
            },
          ],
    [safeUser, signOutUserAction, login, toast, profileSectionsText]
  );

  return !safeAuth ? (
    <ProfileNavSkeleton />
  ) : (
    <ProfileNav
      items={items}
      isLoading={!!provider && !safeUser} // mean web3Auth is connected but waiting for cookie and safe user info
      user={safeUser}
      signInText={signInText}
    />
  );
};
