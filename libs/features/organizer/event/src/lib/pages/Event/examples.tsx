import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import {
  eventDetails2Props,
  eventDetailsProps,
} from '../../molecules/EventDetails/examples';
import {
  event2HeroProps,
  eventHeroProps,
} from '../../molecules/EventHero/examples';
import { Event, EventSkeleton, type EventProps } from './Event';

export const eventProps: EventProps = {
  ...eventHeroProps,
  ...eventDetailsProps,
  purchaseLink: {
    href: {
      pathname: 'dummy',
    },
  },
  purchaseText: 'Purchase',
  id: 'fake_event_1',
  slug: 'event-slug',
};

export const event2Props: EventProps = {
  ...eventProps,
  ...event2HeroProps,
  ...eventDetails2Props,
  id: 'fake_event_2',
  slug: 'event-slug-2',
};

export function EventExample(props: EventProps) {
  return (
    <AppNavLayout {...WithNormalUser.args} children={<Event {...props} />} />
  );
}

export function EventLoadingExample() {
  return <AppNavLayout {...WithNormalUser.args} children={<EventSkeleton />} />;
}
