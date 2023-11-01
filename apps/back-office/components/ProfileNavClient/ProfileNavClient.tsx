'use client';

import {
  ProfileNav,
  ProfileNavSkeleton,
  type ProfileNavProps,
} from '@features/app-nav';
import { useAuthContext } from '@next/auth';
import { useToast } from '@ui/components';
import { LogIn, LogOut } from '@ui/icons';
import { useCallback, useMemo } from 'react';

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
    [safeUser, signOutUserAction, login],
  );

  return !safeAuth ? (
    <ProfileNavSkeleton />
  ) : (
    <>
      <ProfileNav items={items} isLoading={connecting} user={safeUser} />
    </>
  );
};
