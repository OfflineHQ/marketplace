'use client';

import { ProfileAvatar } from '@features/app-nav';
import { interpolateString, Locale } from '@next/i18n';
import { ConnectStatus, useIframeConnect } from '@next/iframe';
import { usePathname, useRouter } from '@next/navigation';
import { AppUser } from '@next/types';
import { useWalletAuth } from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import {
  AvatarSkeleton,
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
} from '@ui/components';
import { LogOut } from '@ui/icons';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useShopifyCustomer } from '../hooks/useShopifyCustomer';

export interface OffKeyProfileProps {
  organizerId: string;
  user: AppUser;
  textProfile: {
    myAccount: string;
    signOut: string;
  };
  locale: Locale;
}
export default function OffKeyProfile({
  user,
  textProfile,
  locale,
  organizerId,
}: OffKeyProfileProps) {
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [userActionLoading, setUserActionLoading] = useState(false);

  const { customer, walletToConnect, walletInStorage } = useShopifyCustomer({
    organizerId,
  });

  const texts = {
    myAccount: interpolateString(textProfile.myAccount, locale, customer),
    signOut: interpolateString(textProfile.signOut, locale, customer),
  };

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
    if (!customer?.id) return;
    if (isWalletReady && wallet && connectToDappMutation.status === 'idle') {
      if (!connectStatus) {
        askForWalletConnectStatus();
      }
      // here if connectStatus is disconnected we launch the process of asking the user to connect to the dapp
      else if (connectStatus === ConnectStatus.DISCONNECTED) {
        connectToDappMutation.mutate(customer.id);
      }
    }
  }, [
    customer?.id,
    connectStatus,
    isWalletReady,
    wallet,
    connectToDappMutation.status,
    askForWalletConnectStatus,
  ]);

  useEffect(() => {
    console.log({
      userAddress: user.address,
      isWalletReady,
      walletToConnect,
      wallet,
      connectWalletMutationStatus: connectWalletMutation.status,
    });
    // here means the wrong wallet is connected (not the same as the one defined for shopify customer)
    if (walletToConnect && walletToConnect !== user.address) {
      signOutUserAction(true);
    } else if (
      isWalletReady &&
      !wallet &&
      connectWalletMutation.status !== 'pending'
    ) {
      connectWalletMutation.mutate(walletToConnect || user.address);
    }
  }, [user.address, isWalletReady, wallet, connectWalletMutation.status]);

  const signOutUserAction = useCallback(
    async (error?: boolean) => {
      try {
        setUserActionLoading(true);
        // TODO: handle error, display error on the sign in page with an alert ? Would need to unset error afterwards
        disconnectFromDapp(user.address);
        await disconnect();
        let newPathname = pathname.split('/0x')[0];
        if (searchParams?.toString()) {
          const params = new URLSearchParams(searchParams.toString());
          newPathname += `?${params.toString()}`;
        }
        await router.replace(newPathname);
      } catch (e) {
        console.error('Error signing out', e);
        throw e;
      } finally {
        setUserActionLoading(false);
      }
    },
    [disconnect],
  );

  const items: DropdownMenuItemsProps['items'] = useMemo(
    () => [
      {
        type: 'label',
        text: texts.myAccount as string,
        className: 'pt-2 pb-0',
      },
      { type: 'separator' },
      {
        type: 'item',
        icon: <LogOut />,
        className: 'cursor-pointer',
        action: signOutUserAction,
        text: texts.signOut as string,
      },
    ],
    [user, signOutUserAction, texts],
  );

  return isWalletReady && customer ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          isIconOnly
          isLoading={
            connectStatus !== ConnectStatus.CONNECTED || userActionLoading
          }
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
