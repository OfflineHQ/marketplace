'use client';

import { useAuthContext } from '@next/auth';
import { Button, useToast } from '@ui/components';
import React, { useMemo, useCallback } from 'react';
import Blabla from './login/page';

export default function Home() {
  const { safeUser, login, logout, safeAuth, provider, connecting } =
    useAuthContext();
  const { toast } = useToast();

  const signOutUserAction = useCallback(async () => {
    await logout({ refresh: true });
    toast({
      title: 'Sign out',
      description: 'Thank you for coming <3',
    });
  }, [logout, toast]);

  const signInUserAction = useCallback(async () => {
    console.log('COUCOUUUUUUU');
    await login();
    toast({
      title: 'Sign in',
      description: 'Thank you for coming <3',
    });
  }, [login, toast]);

  return (
    <>
      <Blabla signInUserAction={signInUserAction} />
    </>
  );
}
