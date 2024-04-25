'use client';

import { ProfileAvatar } from '@features/app-nav';
import { ConnectStatus, useIframeConnect } from '@next/iframe';
import { usePathname, useRouter } from '@next/navigation';
import { AppUser } from '@next/types';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import {
  AvatarSkeleton,
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
  useToast,
} from '@ui/components';
import { LogOut } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

export interface OffKeyProfileProps {
  user: AppUser;
}
export default function OffKeyProfile({ user }: OffKeyProfileProps) {
  const t = useTranslations('Shopify.OffKeyProfile');
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
  const {
    connectStatus,
    disconnectFromDapp,
    signWithEthereum,
    askForWalletConnectStatus,
  } = useIframeConnect();
  const { walletConnected, autoConnectAddress } = useWalletContext();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const connectWalletMutation = useMutation({
    mutationFn: (newWallet: string) => connect(newWallet),
    onSuccess: () => {
      console.log('connected to wallet');
      // Handle successful connection
    },
    onError: (error: any) => {
      // Handle connection error
    },
  });

  const connectToDappMutation = useMutation({
    mutationFn: signWithEthereum,
    onSuccess: () => {
      console.log('connected to dapp');
      // Handle successful connection
    },
    onError: (error: any) => {
      console.log('error connecting to dapp', error);
      signOutUserAction(true);
      //TODO: Handle connection error display
    },
  });

  useEffect(() => {
    console.log({
      wallet,
      connectStatus,
      connectToDappMutationStatus: connectToDappMutation.status,
    });
    if (isWalletReady && wallet && connectToDappMutation.status === 'idle') {
      if (!connectStatus) {
        askForWalletConnectStatus();
      }
      // here if connectStatus is disconnected we launch the process of asking the user to connect to the dapp
      else if (connectStatus === ConnectStatus.DISCONNECTED) {
        connectToDappMutation.mutate();
      }
    }
  }, [
    connectStatus,
    isWalletReady,
    wallet,
    connectToDappMutation.status,
    askForWalletConnectStatus,
  ]);

  useEffect(() => {
    console.log({
      isWalletReady,
      autoConnectAddress,
      walletConnected,
      wallet,
      connectWalletMutationStatus: connectWalletMutation.status,
    });
    const walletToConnect = autoConnectAddress || walletConnected;
    if (
      walletToConnect &&
      isWalletReady &&
      !wallet &&
      connectWalletMutation.status !== 'pending'
    ) {
      connectWalletMutation.mutate(walletToConnect);
    }
  }, [
    walletConnected,
    isWalletReady,
    wallet,
    autoConnectAddress,
    connectWalletMutation.status,
  ]);

  const signOutUserAction = useCallback(
    async (error?: boolean) => {
      // TODO: handle error, display error on the sign in page with an alert ? Would need to unset error afterwards
      disconnectFromDapp(user.address);
      await disconnect();
      let newPathname = pathname.split('/0x')[0];
      if (searchParams?.toString()) {
        const params = new URLSearchParams(searchParams.toString());
        newPathname += `?${params.toString()}`;
      }
      await router.replace(newPathname);
    },
    [disconnect, toast],
  );

  const items: DropdownMenuItemsProps['items'] = useMemo(
    () => [
      {
        type: 'label',
        text: t('my-account'),
        className: 'pt-2 pb-0',
      },
      { type: 'separator' },
      {
        type: 'item',
        icon: <LogOut />,
        className: 'cursor-pointer',
        action: signOutUserAction,
        text: t('sign-out'),
      },
    ],
    [user, signOutUserAction],
  );

  return isWalletReady ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          isIconOnly
          isLoading={connectStatus !== ConnectStatus.CONNECTED}
        >
          <ProfileAvatar className="off-profile-avatar" user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems items={items} />
    </DropdownMenu>
  ) : (
    <OffKeyProfileSkeleton />
  );
}

export function OffKeyProfileSkeleton() {
  return (
    <div className="relative flex items-center justify-center opacity-100">
      <AvatarSkeleton className="off-profile-avatar" />
    </div>
  );
}
