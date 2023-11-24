import {
  SheetHeader,
  SheetNavigation,
  SheetOverflow,
  SheetTitle,
} from '@ui/components';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import {
  EventPassCard,
  type EventPassCardProps,
} from '../EventPassCard/EventPassCard';
export type EventSheetProps = Pick<EventPassCardProps, 'event' | 'organizerId'>;

export const EventSheet = ({ event, organizerId }: EventSheetProps) => {
  const t = useTranslations('OrganizerEvents.Sheet');
  const locale = useLocale();
  return (
    <>
      <SheetHeader size="full">
        <SheetTitle>{event.title}</SheetTitle>
      </SheetHeader>
      <SheetOverflow className="grid h-full gap-8 py-3 pb-28 md:grid-cols-2">
        {event.eventPasses?.map((eventPass, index) => (
          <EventPassCard
            key={index}
            eventPass={eventPass}
            event={event}
            organizerId={organizerId}
          />
        ))}
      </SheetOverflow>
      <SheetNavigation
        wrapper={<Link href={`/${locale}/events`} />}
        size="full"
        backButtonText={t('go-back-to-events')}
      />
    </>
  );
};
