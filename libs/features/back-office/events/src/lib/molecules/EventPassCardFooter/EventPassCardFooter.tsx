import { getEventPassNftFiles } from '@features/back-office/events-api';
import {
  BlockchainAddress,
  Button,
  ButtonSkeleton,
  CardFooter,
  HelperText,
} from '@ui/components';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';
import {
  EventPassDeployButtonClient,
  EventPassDeployButtonClientProps,
} from './EventPassDeployButtonClient';

export interface EventPassCardFooterProps
  extends Omit<EventPassDeployButtonClientProps, 'children'> {}

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
  const isDisabledReasons: string[] = [];

  if (!eventPass.eventPassPricing?.maxAmount)
    isDisabledReasons.push(noPricingSet);
  else {
    const maxAmount = eventPass.eventPassPricing.maxAmount;
    const nftFiles = await getEventPassNftFiles(props);
    if (nftFiles?.length !== maxAmount)
      isDisabledReasons.push(numFilesDoesNotMatch);
  }
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
        <EventPassDeployButtonClient {...props} eventPass={eventPass}>
          {deployContract}
        </EventPassDeployButtonClient>
      )}
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
