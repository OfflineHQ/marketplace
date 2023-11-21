import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { Button, CardFooter, HelperText } from '@ui/components';

export interface EventPassCardFooterProps {
  eventPass: EventFromOrganizerWithPasses['eventPasses'][0];
}

function EventPassContractDeployButton({
  eventPass,
}: EventPassCardFooterProps) {
  const isDisabled = !eventPass.eventPassPricing?.maxAmount;
  const isDisabledReasons = [];
  if (!eventPass.eventPassPricing?.maxAmount)
    isDisabledReasons.push('You need to define your NFTs parameters first');
  return (
    <div className="w-full flex-col">
      <Button block disabled={isDisabled}>
        Deploy
      </Button>
      {isDisabledReasons.length && (
        <HelperText message={isDisabledReasons} variant="warning" />
      )}
    </div>
  );
}

function EventPassContractDeployed({ eventPass }: EventPassCardFooterProps) {
  return <p>Deployed</p>;
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
