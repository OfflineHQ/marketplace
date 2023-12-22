import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { Accordion, CardContent } from '@ui/components';
import { useTranslations } from 'next-intl';
import { EventPassNftDelayedInfos } from '../../molecules/EventPassNftDelayedInfos/EventPassNftDelayedInfos';
import { EventPassNftFiles } from '../../molecules/EventPassNftFiles/EventPassNftFiles';
import {
  EventPassNftsInfos,
  type EventPassNftsInfosProps,
} from '../../molecules/EventPassNftsInfos/EventPassNftsInfos';
import { EventPassSaleParameters } from '../../molecules/EventPassSaleParameters/EventPassSaleParameters';

export interface EventPassCardContentDelayedRevealProps
  extends Omit<EventPassNftsInfosProps, 'title'> {
  event: EventFromOrganizerWithPasses;
  organizerId: string;
}

//TODO - put delayed reveal form and infos here
export const EventPassCardContentDelayedReveal = ({
  eventPass,
  event,
  organizerId,
}: EventPassCardContentDelayedRevealProps) => {
  const t = useTranslations('OrganizerEvents.Sheet.EventPassCard');
  return (
    <CardContent>
      <Accordion type="multiple" defaultValue={['nft-infos']}>
        <EventPassNftsInfos
          eventPass={eventPass}
          title={t('EventPassNftsInfos.delayed-reveal-placeholder-title')}
        />
        <EventPassNftDelayedInfos
          eventPass={eventPass}
          title={t('EventPassNftDelayedInfos.title')}
        />
        <EventPassSaleParameters
          eventPass={eventPass}
          title={t('EventPassSaleParameters.title')}
        />
        <EventPassNftFiles
          eventPass={eventPass}
          organizerId={organizerId}
          eventId={event.id}
          eventPassId={eventPass.id}
          eventSlug={event.slug}
        />
      </Accordion>
    </CardContent>
  );
};
