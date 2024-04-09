import { ProfileAvatar } from '@features/app-nav';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@ui/components';
import { useTranslations } from 'next-intl';

export interface ConnectProps {
  walletAddress?: string;
  isCreatingAccount?: boolean;
}

type ConnectWalletMutationType = UseMutationResult<
  void,
  Error,
  ConnectProps,
  unknown
>;

export interface OffKeyAuthSignInProps
  extends Pick<ReturnType<typeof useWalletAuth>, 'isConnecting'>,
    Pick<ReturnType<typeof useWalletContext>, 'walletInStorage'> {
  connectWalletMutation: ConnectWalletMutationType;
  existingWallet: string;
}

export function OffKeyAuthSignIn({
  isConnecting,
  connectWalletMutation,
  walletInStorage,
  existingWallet,
}: OffKeyAuthSignInProps) {
  const t = useTranslations('Shopify.OffKeyAuth');
  console.log('walletInStorage', walletInStorage);
  return walletInStorage && walletInStorage.length > 1 ? (
    <div className="flex justify-center space-x-2">
      {walletInStorage?.map((wallet) => (
        <Button
          variant="ghost"
          size="lg"
          key={wallet.address}
          onClick={() =>
            connectWalletMutation.mutateAsync({ walletAddress: wallet.address })
          }
          isIconOnly
          className="h-fit rounded-full p-1.5 md:p-1.5"
        >
          <ProfileAvatar user={{ id: '', address: wallet.address }} />
        </Button>
      ))}
    </div>
  ) : (
    <Button
      className="space-x-2"
      block
      onClick={() =>
        connectWalletMutation.mutateAsync({
          walletAddress: existingWallet,
        })
      }
      isLoading={isConnecting}
    >
      {!isConnecting && (
        <ProfileAvatar
          user={{ id: '', address: existingWallet }}
          className="my-1 size-8 md:size-8"
        />
      )}
      <span>{t('sign-in')}</span>
    </Button>
  );
}
