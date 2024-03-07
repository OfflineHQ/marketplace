'use client';

import { ProfileAvatar } from '@features/app-nav';
import { useWalletAuth, useWalletContext } from '@next/wallet';
import { UseMutationResult } from '@tanstack/react-query';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogProps,
  DialogTitle,
  Drawer,
  DrawerClose,
  DrawerContent,
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
  existingWallet,
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
            {/* <DialogDescription>
              {t('dialog-connect-wallet-description')}
            </DialogDescription> */}
          </DialogHeader>
          <AuthActions
            isConnecting={isConnecting}
            connectWalletMutation={connectWalletMutation}
            walletInStorage={walletInStorage}
            existingWallet={existingWallet}
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
          {/* <DrawerDescription>
            {t('dialog-connect-wallet-description')}
          </DrawerDescription> */}
        </DrawerHeader>
        <DrawerFooter className="space-y-4 pt-2">
          <AuthActions
            isConnecting={isConnecting}
            connectWalletMutation={connectWalletMutation}
            walletInStorage={walletInStorage}
            existingWallet={existingWallet}
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
  existingWallet?: string;
}

function AuthActions({
  isConnecting,
  connectWalletMutation,
  walletInStorage,
  existingWallet,
}: AuthActionsProps) {
  const t = useTranslations('Shopify.Auth');
  console.log('walletInStorage', walletInStorage);
  const otherAccounts = existingWallet
    ? walletInStorage?.filter((w) => w.address !== existingWallet)
    : walletInStorage?.slice(1);
  return (
    <div className="flex flex-col space-y-4">
      {otherAccounts?.map((wallet) => (
        <Button
          className="space-x-2"
          key={wallet.address}
          block
          onClick={() =>
            connectWalletMutation.mutateAsync({ walletAddress: wallet.address })
          }
        >
          <ProfileAvatar
            user={{ id: '', address: wallet.address }}
            className="my-1 size-8 md:size-8"
          />
          <span>{t('sign-in')}</span>
        </Button>
      ))}
      <Button block onClick={() => connectWalletMutation.mutateAsync({})}>
        {t('login-with-my-account')}
      </Button>
      <Button
        variant="secondary"
        block
        onClick={() =>
          connectWalletMutation.mutateAsync({ isCreatingAccount: true })
        }
      >
        {t('create-account')}
      </Button>
    </div>
  );
}
