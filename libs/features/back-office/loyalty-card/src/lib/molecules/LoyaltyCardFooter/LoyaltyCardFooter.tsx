import {
  BlockchainAddress,
  Button,
  ButtonSkeleton,
  HelperText,
} from '@ui/components';
import { deepPick } from '@utils';
import { NextIntlClientProvider, useLocale, useTranslations } from 'next-intl';
import { Suspense } from 'react';
// import { checkLoyaltyCardNftFilesHash } from '../../actions/checkLoyaltyCardFilesHash';
// import { getLoyaltyCardNftFiles } from '../../actions/getLoyaltyCardNftFiles';
// import { LoyaltyCardContractRevealButtonClient } from './LoyaltyCardContractRevealButtonClient';
import {
  LoyaltyCardDeployButtonClient,
  LoyaltyCardDeployButtonClientProps,
} from './LoyaltyCardDeployButtonClient';

import { LoyaltyCardOrganizer } from '@features/back-office/loyalty-card-types';
import { messages, type Locale } from '@next/i18n';

export interface LoyaltyCardFooterProps
  extends Omit<LoyaltyCardDeployButtonClientProps, 'children'>,
    Pick<LoyaltyCardOrganizer, 'loyaltyCardNftContract'> {}

function LoyaltyCardContractDeployButton({ ...props }: LoyaltyCardFooterProps) {
  const t = useTranslations('OrganizerLoyaltyCard.Card.LoyaltyCardFooter');
  const texts = {
    noAmountSet: t('no-amount-set'),
    deployContract: t('deploy-contract'),
  };
  return (
    <Suspense fallback={<ButtonSkeleton className="w-full" />}>
      <LoyaltyCardContractDeployButtonContent texts={texts} {...props} />
    </Suspense>
  );
}

interface LoyaltyCardContractDeployButtonContentProps
  extends LoyaltyCardFooterProps {
  texts: {
    deployContract: string;
    noAmountSet: string;
  };
}

async function LoyaltyCardContractDeployButtonContent({
  texts: { deployContract, noAmountSet },
  ...props
}: LoyaltyCardContractDeployButtonContentProps) {
  const isDisabledReasons: string[] = [];
  const locale = useLocale() as Locale;
  const localeMessages = deepPick(messages[locale], [
    'OrganizerLoyaltyCard.Card.LoyaltyCardDeployButtonClient',
  ]);
  return (
    <div className="w-full flex-col">
      {isDisabledReasons?.length ? (
        <>
          <Button block disabled>
            {deployContract}
          </Button>
          <HelperText message={isDisabledReasons} variant="warning" />
        </>
      ) : (
        <NextIntlClientProvider locale={locale} messages={localeMessages}>
          <LoyaltyCardDeployButtonClient {...props}>
            {deployContract}
          </LoyaltyCardDeployButtonClient>
        </NextIntlClientProvider>
      )}
    </div>
  );
}

function LoyaltyCardContractDeployed({
  loyaltyCardNftContract,
}: LoyaltyCardFooterProps) {
  const t = useTranslations('OrganizerLoyaltyCard.Card.LoyaltyCardFooter');
  return (
    <div className="flex w-full items-center justify-center">
      <BlockchainAddress
        address={loyaltyCardNftContract?.contractAddress as string}
        copiedText={t('copied-contract-address')}
      />
    </div>
  );
}

export function LoyaltyCardFooter({
  loyaltyCardNftContract,
  ...props
}: LoyaltyCardFooterProps) {
  return !loyaltyCardNftContract ? (
    <LoyaltyCardContractDeployButton {...props} />
  ) : (
    <LoyaltyCardContractDeployed
      loyaltyCardNftContract={loyaltyCardNftContract}
      {...props}
    />
  );
}
