'use client';

import { ProfileAvatar } from '@features/app-nav';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { UseMutationResult } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProps,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@ui/components';
import { useScreenSize } from '@ui/hooks';
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

export interface AuthDialogDrawerProps
  extends Pick<DialogProps, 'open' | 'onOpenChange'>,
    AuthActionsProps {}

export function AuthDialogDrawer({
  isConnecting,
  connectWalletMutation,
  walletInStorage,
  ...dialogProps
}: AuthDialogDrawerProps) {
  const { isMobile } = useScreenSize();
  const t = useTranslations('Shopify.Auth');

  if (!isMobile) {
    return (
      <Dialog {...dialogProps}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('dialog-connect-wallet')}</DialogTitle>
            <DialogDescription>
              {t('dialog-connect-wallet-description')}
            </DialogDescription>
          </DialogHeader>
          <AuthActions
            isConnecting={isConnecting}
            connectWalletMutation={connectWalletMutation}
            walletInStorage={walletInStorage}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...dialogProps}>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{t('dialog-connect-wallet')}</DrawerTitle>
          <DrawerDescription>
            {t('dialog-connect-wallet-description')}
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="space-y-4 pt-2">
          <AuthActions
            isConnecting={isConnecting}
            connectWalletMutation={connectWalletMutation}
            walletInStorage={walletInStorage}
          />
          <DrawerClose asChild>
            <Button variant="outline">{t('cancel')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface AuthActionsProps
  extends Pick<ReturnType<typeof useWalletAuth>, 'isConnecting'>,
    Pick<ReturnType<typeof useWalletContext>, 'walletInStorage'> {
  connectWalletMutation: ConnectWalletMutationType;
}

function AuthActions({
  isConnecting,
  connectWalletMutation,
  walletInStorage,
}: AuthActionsProps) {
  const t = useTranslations('Shopify.Auth');
  return (
    <div className="flex flex-col space-y-4">
      {walletInStorage &&
        walletInStorage.length > 1 &&
        walletInStorage?.slice(1).map((wallet) => (
          <Button
            className="space-x-2"
            key={wallet.address}
            block
            onClick={() =>
              connectWalletMutation.mutate({ walletAddress: wallet.address })
            }
          >
            {!isConnecting && (
              <ProfileAvatar
                user={{ id: '', address: wallet.address }}
                className="my-1 size-8 md:size-8"
              />
            )}
            <span>{t('sign-in')}</span>
          </Button>
        ))}
      <Button block onClick={() => connectWalletMutation.mutate({})}>
        {t('login-with-my-account')}
      </Button>
      <Button
        variant="secondary"
        block
        onClick={() =>
          connectWalletMutation.mutate({ isCreatingAccount: true })
        }
      >
        {t('create-account')}
      </Button>
    </div>
  );
}
