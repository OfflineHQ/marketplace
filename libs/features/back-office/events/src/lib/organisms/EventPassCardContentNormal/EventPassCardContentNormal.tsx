import { EventFromOrganizerWithPasses } from '@features/back-office/events-types';
import { Accordion, CardContent } from '@ui/components';
import { useTranslations } from 'next-intl';
import { EventPassNftFiles } from '../../molecules/EventPassNftFiles/EventPassNftFiles';
import {
  EventPassNftsInfos,
  type EventPassNftsInfosProps,
} from '../../molecules/EventPassNftsInfos/EventPassNftsInfos';
import { EventPassSaleParameters } from '../../molecules/EventPassSaleParameters/EventPassSaleParameters';

export interface EventPassCardContentNormalProps
  extends Omit<EventPassNftsInfosProps, 'title'> {
  event: EventFromOrganizerWithPasses;
  organizerId: string;
}

export const EventPassCardContentNormal = ({
  eventPass,
  event,
  organizerId,
}: EventPassCardContentNormalProps) => {
  const t = useTranslations('OrganizerEvents.Sheet.EventPassCard');
  return (
    <CardContent>
      <Accordion type="multiple" defaultValue={['nft-infos']}>
        <EventPassNftsInfos
          eventPass={eventPass}
          title={t('EventPassNftsInfos.normal-title')}
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
