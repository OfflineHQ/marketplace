import { Event } from '@features/organizer/event';
import { getEvent } from '@features/organizer/event-api';
import type { Event as TEvent } from '@features/organizer/event-types';
import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
interface EventSectionProps {
  params: {
    eventSlug: string;
    organizerSlug: string;
    locale: string;
  };
}

export default async function EventSection({ params }: EventSectionProps) {
  const { eventSlug, organizerSlug, locale } = params;

  const event = await getEvent({ eventSlug, locale });
  // in case the event is not found or the organizer slug is not the same as the one in the url redirect to 404
  if (!event || event.organizer?.slug !== organizerSlug) {
    return notFound();
  }
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
  const t = useTranslations('Organizer.Event');
  return (
    <Event
      {...event}
      purchaseLink={{
        href: {
          pathname: `/organizer/${organizerSlug}/event/${eventSlug}/purchase`,
          // query: {
          //   organizerSlug: organizerSlug,
          //   eventSlug: eventSlug,
          // },
        },
      }}
      purchaseText={t('purchase-button-activator')}
    />
  );
}
