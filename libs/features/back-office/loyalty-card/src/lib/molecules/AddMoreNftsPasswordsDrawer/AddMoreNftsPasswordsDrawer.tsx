'use client';
import { LoyaltyCardNftContract } from '@gql/shared/types';
import { useWalletContext } from '@next/wallet';
import {
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  TextInput,
  useToast,
} from '@ui/components';
import { getErrorMessage } from '@utils';
import { toSafeInteger } from 'lodash';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { createNftsPasswords } from '../../actions/createNftsPasswords';
import { resetNftMintPasswordsForContract } from '@features/back-office/loyalty-card-api';

export interface AddMoreNftsPasswordsProps
  extends Pick<
    LoyaltyCardNftContract,
    'contractAddress' | 'chainId' | 'loyaltyCardId'
  > {
  triggerText: string;
  className?: string;
}

export function AddMoreNftsPasswordsDrawer({
  triggerText,
  className,
  contractAddress,
  chainId,
  loyaltyCardId,
}: AddMoreNftsPasswordsProps) {
  const t = useTranslations(
    'OrganizerLoyaltyCard.Card.AddMoreNftsPasswordsDrawer',
  );
  const [numberOfPasswords, setNumberOfPasswords] = useState(100);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const { provider } = useWalletContext();
  async function handleAddMorePasswords() {
    if (!provider) return;
    const signer = await provider?.getSigner();
    if (!signer) throw new Error('noSigner');
    try {
      const passwords = await createNftsPasswords({
        signer,
        contractAddress,
        chainId,
        amount: numberOfPasswords,
      });
      if (passwords?.length === 0) throw new Error('noPasswords');
      toast({
        title: t('success-title'),
        description: t('success-description', {
          numberOfPasswords: passwords?.length,
        }),
      });
      await resetNftMintPasswordsForContract({
        contractAddress,
        chainId,
      });
      setOpen(false);
    } catch (error) {
      console.error({ error });
      toast({
        title: t('error-title'),
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>{triggerText}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('add-passwords-title')}</DrawerTitle>
            <DrawerDescription>
              {t('add-passwords-description')}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <TextInput
              type="number"
              label={t('number')}
              leftLabel
              defaultValue={100}
              onChange={(e) =>
                setNumberOfPasswords(toSafeInteger(e.target.value))
              }
            ></TextInput>
          </div>
          <DrawerFooter>
            <Button onClick={handleAddMorePasswords}>
              {t('add-passwords-submit')}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">{t('add-passwords-cancel')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
