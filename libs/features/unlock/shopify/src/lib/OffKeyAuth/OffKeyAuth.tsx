'use client';

import { usePathname, useRouter } from '@next/navigation';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import { Button, ButtonSkeleton } from '@ui/components';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';

import { ConnectProps, OffKeyAuthSignIn } from './OffKeyAuthSignIn';

export interface OffKeyAuthProps {
  organizerId: string;
}

export function OffKeyAuth({ organizerId }: OffKeyAuthProps) {
  const t = useTranslations('Shopify.OffKeyAuth');
  const {
    connect,
    isReady: isWalletReady,
    isConnecting,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const { walletConnected, walletInStorage } = useWalletContext();
  const existingWallet = walletConnected || walletInStorage?.[0]?.address;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    customer,
    status: shopifyCustomerStatus,
    walletToConnect,
  } = useShopifyCustomer({
    organizerId,
  });

  const connectWalletMutation = useMutation({
    mutationFn: ({ walletAddress, isCreatingAccount }: ConnectProps) =>
      connect(walletAddress, isCreatingAccount),
    onSuccess: (data, { walletAddress, isCreatingAccount }, context) => {
      console.log({ data, walletAddress, isCreatingAccount, context });
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
  if (!isWalletReady || !shopifyCustomerStatus) return <OffKeyAuthSkelton />;
  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      {existingWallet ? (
        <OffKeyAuthSignIn
          {...{
            isConnecting,
            connectWalletMutation,
            walletInStorage,
            existingWallet,
          }}
        />
      ) : (
        <Button
          block
          onClick={() =>
            connectWalletMutation.mutateAsync({ isCreatingAccount: true })
          }
        >
          {t('create-new-account')}
        </Button>
      )}
      {existingWallet ? (
        <div className="flex justify-evenly space-x-2">
          <Button
            variant="link"
            className="underline"
            onClick={() =>
              connectWalletMutation.mutateAsync({ isCreatingAccount: true })
            }
          >
            {t('create-new-account')}
          </Button>
          <Button
            variant="link"
            className="underline"
            onClick={() => connectWalletMutation.mutateAsync({})}
          >
            {t('use-existing-account')}
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          block
          onClick={() => connectWalletMutation.mutateAsync({})}
        >
          {t('use-existing-account')}
        </Button>
      )}
      {/* {isDialog ? (
        <AuthDialogDynamic
          open={isDialog}
          onOpenChange={setIsDialog}
          walletInStorage={walletInStorage}
          existingWallet={existingWallet || ''}
          connectWalletMutation={connectWalletMutation}
          isConnecting={isConnecting}
        />
      ) : null} */}
    </div>
  );
}

export function OffKeyAuthSkelton() {
  return (
    <div className="flex w-full flex-1 flex-col justify-end space-y-3">
      <ButtonSkeleton className="w-full bg-primary" />
      <ButtonSkeleton className="w-full" />
    </div>
  );
}
