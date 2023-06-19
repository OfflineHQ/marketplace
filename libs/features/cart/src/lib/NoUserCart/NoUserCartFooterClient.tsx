'use client';

import { Button, ButtonSkeleton } from '@ui/components';
import { LogIn } from '@ui/icons';
import { signIn } from 'next-auth/react';
import { useAuthContext } from '@next/auth';

interface NoUserCartFooterClientProps {
  signInText: string;
}

export const NoUserCartFooterClient: React.FC<NoUserCartFooterClientProps> = ({
  signInText,
}) => {
  const { login, safeAuth, connecting } = useAuthContext();
  return !safeAuth ? (
    <ButtonSkeleton className="w-full md:w-1/6" />
  ) : (
    <Button
      onClick={login}
      icon={LogIn}
      isLoading={connecting}
      block
      className="w-full md:w-1/6"
    >
      {signInText}
    </Button>
  );
};
