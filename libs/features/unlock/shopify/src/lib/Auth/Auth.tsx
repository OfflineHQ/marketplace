'use client';

import { ProfileAvatar } from '@features/app-nav';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { Button, useToast } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface ShopifyAuthProps {}

export function ShopifyAuth({}: ShopifyAuthProps) {
  const t = useTranslations('Shopify.Auth');
  const { toast } = useToast();
  const {
    connect,
    disconnect,
    isReady: isWalletReady,
    isConnecting,
    isConnected,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const { walletConnected, wcUri, walletInStorage } = useWalletContext();
  const existingWallet = walletConnected || walletInStorage?.first().address;

  const connectWalletMutation = useMutation({
    mutationFn: (newWallet: string) => connect(newWallet),
    onSuccess: () => {
      // Handle successful connection
    },
    onError: (error: any) => {
      // Handle connection error
    },
  });
  // useEffect(() => {
  //   if (
  //     existingWallet &&
  //     isReady &&
  //     !wallet &&
  //     !!(connectWalletMutation.status !== 'pending')
  //   ) {
  //     connectWalletMutation.mutate(existingWallet);
  //   }
  // }, [connectionError, existingWallet, isReady, wallet]);
  return (
    <div className="flex w-full flex-col space-y-4">
      {existingWallet ? (
        <Button
          className="space-x-2"
          block
          isLoading={isConnecting}
          onClick={() => connectWalletMutation.mutate(existingWallet)}
        >
          {!isConnecting && (
            <ProfileAvatar
              user={{ id: '', address: existingWallet }}
              className="my-1 size-8 md:size-8"
            />
          )}
          <span>{t('sign-in')}</span>
        </Button>
      ) : (
        <Button block onClick={() => connect()}>
          {t('create-account')}
        </Button>
      )}
      <Button variant="secondary" block onClick={() => disconnect()}>
        {existingWallet
          ? t('login-different-account-or-create-account')
          : t('login-with-my-account')}
      </Button>
    </div>
  );
}
