'use client';

import { useAuthContext } from '@next/auth';
import { Button, ButtonSkeleton } from '@ui/components';
import { LogIn } from '@ui/icons';

export interface NoUserPassFooterClientProps {
  signInText: string;
}

export const NoUserPassFooterClient: React.FC<NoUserPassFooterClientProps> = ({
  signInText,
}) => {
  const { login, safeAuth, connecting } = useAuthContext();
  return !safeAuth ? (
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
