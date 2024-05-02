'use client';

import { useWalletContext } from '@next/wallet';
import { Button, ButtonSkeleton, useToast } from '@ui/components';
import { getErrorMessage } from '@utils';
import { useLocale, useTranslations } from 'next-intl';
import React from 'react';
import {
  DeployLoyaltyCardCollectionWrapperProps,
  deployLoyaltyCardCollectionWrapper,
} from '../../actions/deployLoyaltyCardCollectionWrapper';
import { resetLoyaltyCard } from '../../actions/resetLoyaltyCard';

export interface LoyaltyCardDeployButtonClientProps
  extends Omit<DeployLoyaltyCardCollectionWrapperProps, 'signer'> {
  children: React.ReactNode;
}

export function LoyaltyCardDeployButtonClient({
  children,
  ...props
}: LoyaltyCardDeployButtonClientProps) {
  const { toast } = useToast();
  const { provider } = useWalletContext();
  const t = useTranslations(
    'OrganizerLoyaltyCard.Card.LoyaltyCardDeployButtonClient',
  );
  const locale = useLocale();

  async function deployContract() {
    if (!provider) return;
    const signer = await provider?.getSigner();
    if (!signer) throw new Error('noSigner');
    try {
      await deployLoyaltyCardCollectionWrapper({
        ...props,
        signer,
      });
      toast({
        title: t('success-title'),
        description: t('success-description'),
      });
      await resetLoyaltyCard({ locale });
    } catch (error) {
      console.error(error);
      toast({
        title: t('error-title'),
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    }
  }
  return provider ? (
    <Button block onClick={deployContract}>
      {children}
    </Button>
  ) : (
    <ButtonSkeleton className="w-full" />
  );
}
