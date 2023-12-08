import { getEventPassNftFiles } from '@features/back-office/events-api';
import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { GetEventPassOrganizerFolderPath } from '@features/pass-common';
import {
  BlockchainAddress,
  Button,
  ButtonSkeleton,
  CardFooter,
  HelperText,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

export interface EventPassCardFooterProps
  extends GetEventPassOrganizerFolderPath {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

function EventPassContractDeployButton({
  eventPass,
  ...props
}: EventPassCardFooterProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter',
  );
  const texts = {
    deployContract: t('deploy-contract'),
    noPricingSet: t('no-pricing-set'),
    numFilesDoesNotMatch: t('num-files-does-not-match'),
  };
  return (
    <Suspense fallback={<ButtonSkeleton className="w-full" />}>
      <EventPassContractDeployButtonContent
        eventPass={eventPass}
        texts={texts}
        {...props}
      />
    </Suspense>
  );
}

interface EventPassContractDeployButtonContentProps
  extends EventPassCardFooterProps {
  texts: {
    deployContract: string;
    noPricingSet: string;
    numFilesDoesNotMatch: string;
  };
}

async function EventPassContractDeployButtonContent({
  eventPass,
  texts: { deployContract, noPricingSet, numFilesDoesNotMatch },
  ...props
}: EventPassContractDeployButtonContentProps) {
  const isDisabled = !eventPass.eventPassPricing?.maxAmount;
  const isDisabledReasons: string[] = [];

  if (!eventPass.eventPassPricing?.maxAmount)
    isDisabledReasons.push(noPricingSet);
  else {
    const maxAmount = eventPass.eventPassPricing.maxAmount;
    const nftFiles = await getEventPassNftFiles(props);
    console.log('nftFiles', nftFiles?.length, maxAmount);
  }
  return (
    <div className="w-full flex-col">
      <Button block disabled={isDisabled}>
        {deployContract}
      </Button>
      <HelperText message={isDisabledReasons} variant="warning" />
    </div>
  );
}

function EventPassContractDeployed({ eventPass }: EventPassCardFooterProps) {
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter',
  );
  return (
    <BlockchainAddress
      address={eventPass.eventPassNftContract?.contractAddress as string}
      copiedText={t('copied-contract-address')}
    />
  );
}

export function EventPassCardFooter({
  eventPass,
  ...props
}: EventPassCardFooterProps) {
  return (
    <CardFooter>
      {!eventPass.eventPassNftContract ? (
        <EventPassContractDeployButton eventPass={eventPass} {...props} />
      ) : (
        <EventPassContractDeployed eventPass={eventPass} {...props} />
      )}
    </CardFooter>
  );
}
