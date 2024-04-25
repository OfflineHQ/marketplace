import { ProfileAvatar } from '@features/app-nav';
import { useWalletContext } from '@next/wallet';
import { UseMutationResult } from '@tanstack/react-query';
import { Button } from '@ui/components';

export interface ConnectProps {
  walletAddress?: string;
  isCreatingAccount?: boolean;
  walletToConnect?: string;
}

type ConnectWalletMutationType = UseMutationResult<
  void,
  Error,
  ConnectProps,
  unknown
>;

export interface OffKeyAuthSignInProps
  extends Pick<ReturnType<typeof useWalletContext>, 'walletInStorage'> {
  connectWalletMutation: ConnectWalletMutationType;
  signInText: string;
  walletToConnect?: string;
}

export function OffKeyAuthSignIn({
  connectWalletMutation,
  signInText,
  walletInStorage,
  walletToConnect,
}: OffKeyAuthSignInProps) {
  if (!walletInStorage?.length) return null;
  if (walletToConnect) {
    return (
      <Button
        className="space-x-2"
        block
        onClick={() =>
          connectWalletMutation.mutateAsync({
            walletAddress: walletToConnect,
          })
        }
      >
        <ProfileAvatar
          user={{ id: '', address: walletToConnect }}
          size="auto"
        />
        <span>{signInText}</span>
      </Button>
    );
  }
  return walletInStorage.length > 1 ? (
    <div className="flex justify-center space-x-6">
      {walletInStorage.map((wallet) => (
        <Button
          variant="ghost"
          key={wallet.address}
          onClick={() =>
            connectWalletMutation.mutateAsync({ walletAddress: wallet.address })
          }
          isIconOnly
          className="size-fit rounded-full p-0 md:p-0"
        >
          <ProfileAvatar
            size="auto"
            user={{ id: '', address: wallet.address }}
          />
        </Button>
      ))}
    </div>
  ) : (
    <Button
      className="space-x-2"
      block
      onClick={() =>
        connectWalletMutation.mutateAsync({
          walletAddress: walletInStorage[0].address,
        })
      }
    >
      <ProfileAvatar
        user={{ id: '', address: walletInStorage[0].address }}
        size="auto"
      />
      <span>{signInText}</span>
    </Button>
  );
}
