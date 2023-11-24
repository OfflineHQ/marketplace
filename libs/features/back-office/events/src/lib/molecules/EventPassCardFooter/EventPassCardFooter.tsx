import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import {
  BlockchainAddress,
  Button,
  CardFooter,
  HelperText,
} from '@ui/components';
import { useTranslations } from 'next-intl';

export interface EventPassCardFooterProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

function EventPassContractDeployButton({
  eventPass,
}: EventPassCardFooterProps) {
  const isDisabled = !eventPass.eventPassPricing?.maxAmount;
  const isDisabledReasons: string[] = [];
  const t = useTranslations(
    'OrganizerEvents.Sheet.EventPassCard.EventPassCardFooter',
  );
  if (!eventPass.eventPassPricing?.maxAmount)
    isDisabledReasons.push(t('no-pricing-set'));
  return (
    <div className="w-full flex-col">
      <Button block disabled={isDisabled}>
        {t('deploy-contract')}
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

export function EventPassCardFooter({ eventPass }: EventPassCardFooterProps) {
  return (
    <CardFooter>
      {!eventPass.eventPassNftContract ? (
        <EventPassContractDeployButton eventPass={eventPass} />
      ) : (
        <EventPassContractDeployed eventPass={eventPass} />
      )}
    </CardFooter>
  );
}
