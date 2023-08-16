'use client';

import React, { useMemo, useCallback } from 'react';
import { LogIn, Settings, LifeBuoy, LogOut } from '@ui/icons';
import { useToast } from '@ui/components';
import { useAuthContext } from '@next/auth';
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

export const ProfileNavClient = () => {
  const { safeUser, login, logout, safeAuth, connecting } = useAuthContext();
  const { toast } = useToast();

  const signOutUserAction = useCallback(async () => {
    await logout({ refresh: true });
    toast({
      title: 'Successfully sign out',
      description: 'See you soon',
    });
  }, [logout, toast]);

  const items: ProfileNavProps['items'] = useMemo(
    () =>
      !safeUser
        ? [
            {
              type: 'item',
              icon: <LogIn />,
              className: 'cursor-pointer font-semibold',
              action: login,
              text: 'Sign In',
            },
          ]
        : [
            {
              type: 'item',
              icon: <LogOut />,
              className: 'cursor-pointer',
              action: signOutUserAction,
              text: 'Sign out',
            },
          ],
    [safeUser, signOutUserAction, login]
  );

  return !safeAuth ? (
    <ProfileNavSkeleton />
  ) : (
    <>
      <ProfileNav items={items} isLoading={connecting} user={safeUser} />
      <div className="grid h-screen place-items-center">
        Welcome to the Offline Dashboard {safeUser?.name}
      </div>
    </>
  );
};
