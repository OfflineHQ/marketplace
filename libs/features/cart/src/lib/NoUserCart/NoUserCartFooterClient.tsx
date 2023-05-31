'use client';

import { Button, ButtonSkeleton } from '@ui/components';
import { LogIn } from '@ui/icons';
import { signIn } from 'next-auth/react';
import { useAuthContext } from '@client/auth';

interface NoUserCartFooterClientProps {
  signInText: string;
}

export const NoUserCartFooterClient: React.FC<NoUserCartFooterClientProps> = ({
  signInText,
}) => {
  const { login, safeAuth, safeUser, provider } = useAuthContext();
  return !safeAuth ? (
    <ButtonSkeleton className="w-full md:w-1/6" />
  ) : (
    <Button
      onClick={login}
      icon={LogIn}
      isLoading={!!provider && !safeUser}
      block
      className="w-full md:w-1/6"
    >
      {signInText}
    </Button>
  );
};
