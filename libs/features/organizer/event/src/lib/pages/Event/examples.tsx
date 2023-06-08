import {
  eventHeroProps,
  event2HeroProps,
} from '../../molecules/EventHero/examples';
import {
  eventDetailsProps,
  long_description,
} from '../../molecules/EventDetails/examples';
import { Event, EventSkeleton, type EventProps } from './Event';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';

export const eventProps: EventProps = {
  ...eventHeroProps,
  ...eventDetailsProps,
  id: 'fake_event_1',
  slug: 'test-event-1',
  description: long_description,
  purchaseLink: { href: { pathname: '/dummy' } },
  purchaseText: 'Select passes',
};

export const event2Props: EventProps = {
  ...eventProps,
  ...event2HeroProps,
  ...eventDetailsProps,
  id: 'fake_event_2',
  slug: 'test-event-2',
};

export function EventExample(props: EventProps) {
  return (
    <AppNavLayout {...WithNormalUser.args} children={<Event {...props} />} />
  );
}

export function EventLoadingExample() {
  return <AppNavLayout {...WithNormalUser.args} children={<EventSkeleton />} />;
}
