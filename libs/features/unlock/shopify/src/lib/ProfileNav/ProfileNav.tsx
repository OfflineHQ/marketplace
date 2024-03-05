'use client';

import env from '@env/client';
import { ProfileAvatar } from '@features/app-nav';
import { usePathname, useRouter } from '@next/navigation';
import { AppUser } from '@next/types';
import { useWalletAuth } from '@next/wallet';
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
import { LifeBuoy, LogOut, Settings, VerifyEmail } from '@ui/icons';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

export interface ShopifyProfileNavProps {
  user: AppUser;
  isLoading?: boolean;
}

const VerifyEmailDynamic = dynamic(
  async () => (await import('@features/kyc')).SumsubDialog,
  { ssr: false },
);

export const ShopifyProfileNav: React.FC<ShopifyProfileNavProps> = ({
  user,
  isLoading,
}) => {
  const t = useTranslations('Shopify.Profile');
  const { toast } = useToast();
  const {
    connect,
    disconnect,
    isReady,
    isConnecting,
    isConnected,
    provider,
    wallet,
    connectionError,
  } = useWalletAuth();
  const [isVerifyEmail, setIsVerifyEmail] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const signOutUserAction = useCallback(async () => {
    await disconnect();
    const newPathname = pathname.split('/0x')[0];
    await router.replace(newPathname);
    toast({
      title: t('sign-out-title'),
      description: t('sign-out-description'),
    });
  }, [disconnect, toast]);

  const items: DropdownMenuItemsProps['items'] = useMemo(
    () => [
      {
        type: 'label',
        text: t('my-account'),
        className: 'pt-2 pb-0',
      },
      {
        type: 'children',
        icon: <Settings />,
        children: (
          <div className="cursor-pointer font-semibold">
            <a
              href={`${env.NEXT_PUBLIC_WEB_APP_URL}?address=${user.address}`}
              target="_blank"
              rel="noreferrer"
            >
              {t('view-account')}
            </a>
          </div>
        ),
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
            className: 'cursor-pointer font-semibold',
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
  return (
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
              {isLoading ? (
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
  );
};

export function ProfileNavSkeleton() {
  return (
    <div className="relative inline-block items-center justify-center opacity-100 md:flex">
      <AvatarSkeleton className="size-12 md:mx-5" />
      <TextSkeleton className="mr-5 hidden md:flex" />
    </div>
  );
}
