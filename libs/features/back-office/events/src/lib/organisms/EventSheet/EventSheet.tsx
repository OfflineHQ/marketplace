import {
  SheetHeader,
  SheetNavigation,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetTitle,
  SheetTitleSkeleton,
} from '@ui/components';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { EventStatusBadge } from '../../molecules/EventStatusBadge/EventStatusBadge';
import {
  EventPassCard,
  EventPassCardSkeleton,
  type EventPassCardProps,
} from '../EventPassCard/EventPassCard';
export type EventSheetProps = Pick<EventPassCardProps, 'event' | 'organizerId'>;

export const EventSheet = ({ event, organizerId }: EventSheetProps) => {
  const t = useTranslations('OrganizerEvents.Sheet');
  const locale = useLocale();
  return (
    <>
      <SheetHeader size="full">
        <SheetTitle className="flex items-baseline space-x-2">
          <span>{event.title}</span>
          <EventStatusBadge status={event.eventParameters?.status} />
        </SheetTitle>
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
        wrapper={<Link href={`/${locale}/campaigns/events`} />}
        size="full"
        backButtonText={t('go-back-to-events')}
      />
    </>
  );
};

export const EventSheetSkeleton = () => {
  return (
    <>
      <SheetNavigationSkeleton size="full" />
      <SheetHeader size="full">
        <SheetTitleSkeleton />
      </SheetHeader>
      <SheetOverflow className="grid h-full gap-8 py-3 pb-28 md:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <EventPassCardSkeleton key={index} />
        ))}
      </SheetOverflow>
    </>
  );
};
