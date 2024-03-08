'use client';

import env from '@env/client';
import { ProfileAvatar } from '@features/app-nav';
import { usePathname, useRouter } from '@next/navigation';
import { AppUser } from '@next/types';
import {
  useWalletAuth,
  useWalletConnect,
  useWalletContext,
} from '@next/wallet';
import { useMutation } from '@tanstack/react-query';
import {
  AutoAnimate,
  AvatarSkeleton,
  Button,
  DropdownMenu,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  DropdownMenuTrigger,
  Spinner,
  TextSkeleton,
  useToast,
} from '@ui/components';
import { Key, LifeBuoy, LogOut, VerifyEmail } from '@ui/icons';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface ShopifyProfileNavProps {
  user: AppUser;
}

const VerifyEmailDynamic = dynamic(
  async () => (await import('@features/kyc')).SumsubDialog,
  { ssr: false },
);

export const ShopifyProfileNav: React.FC<ShopifyProfileNavProps> = ({
  user,
}) => {
  const t = useTranslations('Shopify.Profile');
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
  const {
    initializeWalletConnect,
    connectToDapp,
    isReady,
    isLoadingPairing,
    isLoadingApprove,
    isConnectedToDapp,
  } = useWalletConnect({ address: user.address });
  const { walletConnected, wcUri, autoConnectAddress } = useWalletContext();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const connectWalletMutation = useMutation({
    mutationFn: (newWallet: string) => connect(newWallet),
    onSuccess: () => {
      // Handle successful connection
    },
    onError: (error: any) => {
      // Handle connection error
    },
  });

  useEffect(() => {
    console.log({ wallet, isReady });
    if (wallet && !isReady) initializeWalletConnect();
  }, [initializeWalletConnect, wallet, isReady]);

  useEffect(() => {
    console.log('wcUri', wcUri, 'isReady', isReady);
    if (wcUri && isReady) {
      connectToDapp(wcUri);
    }
  }, [wcUri, isReady, connectToDapp]);

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
    connectionError,
    walletConnected,
    isWalletReady,
    wallet,
    connectWalletMutation.status,
    autoConnectAddress,
  ]);

  const signOutUserAction = useCallback(async () => {
    await disconnect();
    let newPathname = pathname.split('/0x')[0];
    if (searchParams?.toString()) {
      newPathname += `?${searchParams.toString()}`;
    }
    await router.replace(newPathname);
    toast({
      title: t('sign-out-title'),
      description: t('sign-out-description'),
    });
  }, [disconnect, toast]);

  function WrapperLink({ children }: { children?: React.ReactNode }) {
    return (
      <a
        href={`${env.NEXT_PUBLIC_WEB_APP_URL}?address=${user.address}`}
        target="_blank"
        rel="noreferrer"
      >
        {children}
      </a>
    );
  }

  const items: DropdownMenuItemsProps['items'] = useMemo(
    () => [
      {
        type: 'label',
        text: t('my-account'),
        className: 'pt-2 pb-0',
      },
      {
        type: 'item',
        icon: <Key />,
        text: t('view-account'),
        className: 'cursor-pointer',
        wrapper: <WrapperLink />,
      },
      user.email
        ? {
            type: 'children',
            children: (
              <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
                {user.email}
              </div>
            ),
          }
        : {
            type: 'item',
            icon: <VerifyEmail />,
            className: 'cursor-pointer',
            action: () => setIsVerifyEmail(true),
            text: t('verify-email'),
          },
      { type: 'separator' },
      {
        type: 'item',
        icon: <LifeBuoy />,
        className: 'cursor-pointer',
        text: t('support'),
        action: () =>
          toast({
            title: t('support-toast-title'),
            description: t('support-toast-description'),
          }),
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
    <>
      {isVerifyEmail && (
        <VerifyEmailDynamic
          open={isVerifyEmail}
          confirmedText={t('verify-email-continue')}
          onOpenChange={setIsVerifyEmail}
          title={t('verify-email')}
        />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="mb-1 mr-1 flex space-x-2 rounded-full py-1 pl-1 pr-2"
          >
            <AutoAnimate>
              {!isConnectedToDapp ? (
                <Spinner
                  size="lg"
                  variant="ghost"
                  className="mr-1.5 mt-2 size-8 md:mr-0 md:mt-0 md:size-12 md:p-2"
                />
              ) : (
                <ProfileAvatar user={user} className="my-1 size-9 md:size-9" />
              )}
            </AutoAnimate>
            <div className="flex pb-0 font-medium">{t('my-account')}</div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuItems items={items} />
      </DropdownMenu>
    </>
  ) : (
    <ProfileNavSkeleton />
  );
};

export function ProfileNavSkeleton() {
  return (
    <div className="relative flex items-center justify-center opacity-100">
      <AvatarSkeleton className="mx-3 size-9 md:size-10" />
      <TextSkeleton className="mr-3 flex" />
    </div>
  );
}
