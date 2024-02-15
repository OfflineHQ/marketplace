'use client';

import { useAuthContext } from '@next/auth';
import { Button, ButtonSkeleton } from '@ui/components';
import { LogIn } from '@ui/icons';

interface NoUserCartFooterClientProps {
  signInText: string;
}

export const NoUserCartFooterClient: React.FC<NoUserCartFooterClientProps> = ({
  signInText,
}) => {
  const { login, isReady, connecting } = useAuthContext();
  return !isReady ? (
    <ButtonSkeleton className="w-full md:w-1/6" />
  ) : (
    <Button
      onClick={login}
      icon={<LogIn />}
      isLoading={connecting}
      block
      className="w-full md:w-1/6"
    >
      {signInText}
    </Button>
  );
};
