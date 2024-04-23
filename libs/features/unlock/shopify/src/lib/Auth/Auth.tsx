'use client';

import { ProfileAvatar } from '@features/app-nav';
import { usePathname, useRouter } from '@next/navigation';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonSkeleton, useToast } from '@ui/components';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { ConnectProps } from './AuthDialogDrawer';

const AuthDialogDynamic = dynamic(
  () => import('./AuthDialogDrawer').then((mod) => mod.AuthDialogDrawer),
  { ssr: false },
);

export function ShopifyAuth() {
  const t = useTranslations('Shopify.Auth');
  const { toast } = useToast();
  const {
    connect,
    disconnect,
    isReady: isWalletReady,
    isConnecting,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const { walletConnected, wcUri, walletInStorage } = useWalletContext();
  const existingWallet = walletConnected || walletInStorage?.[0]?.address;
  const [isDialog, setIsDialog] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const connectWalletMutation = useMutation({
    mutationFn: ({ walletAddress, isCreatingAccount }: ConnectProps) =>
      connect(walletAddress, isCreatingAccount),
    onSuccess: (data, { walletAddress, isCreatingAccount }, context) => {
      console.log({ data, walletAddress, isCreatingAccount, context });
      if (isCreatingAccount) {
        toast({
          title: t('account-created'),
        });
      }
      console.log({ pathname, walletAddress });
      let url = `${pathname}/${walletAddress}`;
      if (searchParams?.toString()) {
        const params = new URLSearchParams(searchParams.toString());
        url += `?${params.toString()}`;
      }
      router.replace(url);
    },
    onError: (error: any) => {
      console.error({ error });
      // Handle connection error
    },
  });
  if (!isWalletReady) return <ShopifyAuthSkelton />;
  return (
    <div className="flex w-full flex-col space-y-4">
      {existingWallet ? (
        <Button
          className="space-x-2"
          block
          onClick={() =>
            connectWalletMutation.mutateAsync({
              walletAddress: existingWallet,
            })
          }
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
        <Button
          block
          onClick={() =>
            connectWalletMutation.mutateAsync({ isCreatingAccount: true })
          }
        >
          {t('create-account')}
        </Button>
      )}
      {existingWallet ? (
        <Button variant="secondary" block onClick={() => setIsDialog(true)}>
          {t('login-different-account')}
        </Button>
      ) : (
        <Button
          variant="secondary"
          block
          onClick={() => connectWalletMutation.mutateAsync({})}
        >
          {t('login-with-my-account')}
        </Button>
      )}
      {isDialog ? (
        <AuthDialogDynamic
          open={isDialog}
          onOpenChange={setIsDialog}
          walletInStorage={walletInStorage}
          existingWallet={existingWallet || ''}
          connectWalletMutation={connectWalletMutation}
          isConnecting={isConnecting}
        />
      ) : null}
    </div>
  );
}

export function ShopifyAuthSkelton() {
  return (
    <div className="flex w-full flex-col space-y-4">
      <ButtonSkeleton className="w-full bg-primary" />
      <ButtonSkeleton className="w-full" />
    </div>
  );
}
