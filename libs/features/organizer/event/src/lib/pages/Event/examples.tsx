import { eventHeroProps } from '../../molecules/EventHero/examples';
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
  description: long_description,
  purchaseLink: { href: { pathname: '/dummy' } },
  purchaseText: 'Select passes',
};

export function EventExample(props: EventProps) {
  return (
    <AppNavLayout {...WithNormalUser.args} children={<Event {...props} />} />
  );
}

export function EventLoadingExample() {
  return <AppNavLayout {...WithNormalUser.args} children={<EventSkeleton />} />;
}
