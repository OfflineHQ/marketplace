import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { Accordion, CardContent } from '@ui/components';
import { EventPassNftFiles } from '../../molecules/EventPassNftFiles/EventPassNftFiles';
import {
  EventPassNftsInfos,
  type EventPassNftsInfosProps,
} from '../../molecules/EventPassNftsInfos/EventPassNftsInfos';

export interface EventPassCardContentProps extends EventPassNftsInfosProps {
  event: EventFromOrganizerWithPasses;
  organizerId: string;
}

export const EventPassCardContent = ({
  eventPass,
  event,
  organizerId,
}: EventPassCardContentProps) => {
  return (
    <CardContent>
      <Accordion type="multiple" defaultValue={['nft-infos']}>
        <EventPassNftsInfos eventPass={eventPass} />
        <EventPassNftFiles
          eventPass={eventPass}
          organizerId={organizerId}
          eventId={event.id}
          eventPassId={eventPass.id}
        />
      </Accordion>
    </CardContent>
  );
};
