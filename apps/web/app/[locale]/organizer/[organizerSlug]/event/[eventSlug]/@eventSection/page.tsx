import { getEvent } from '@features/organizer/event/server';
import type { Event as TEvent } from '@features/organizer/event/types';
import { Event, type EventProps } from '@features/organizer/event';
import { useTranslations } from 'next-intl';

interface EventSectionProps {
  params: {
    eventSlug: string;
    organizerSlug: string;
    locale: string;
  };
}

export default async function EventSection({ params }: EventSectionProps) {
  const { eventSlug, organizerSlug, locale } = params;

  const event = await getEvent({ eventSlug, organizerSlug });
  return (
    <EventSectionContent
      event={event}
      eventSlug={eventSlug}
      organizerSlug={organizerSlug}
    />
  );
}

interface EventSectionContentProps {
  event: TEvent;
  eventSlug: string;
  organizerSlug: string;
}

function EventSectionContent({
  event,
  eventSlug,
  organizerSlug,
}: EventSectionContentProps) {
  console.log({ eventSlug, organizerSlug });
  const t = useTranslations('Organizer.Event');
  return (
    <Event
      {...event}
      purchaseLink={{
        href: {
          pathname: `/organizer/${organizerSlug}/event/${eventSlug}/@purchaseSection`,
          // query: {
          //   organizerSlug: organizerSlug,
          //   eventSlug: eventSlug,
          // },
        },
      }}
      purchaseText={t('purchase-button-activator')}
      detailsTitle={t('details.title')}
    />
  );
}
