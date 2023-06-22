import {
  Card,
  CardHeader,
  CardFooter,
  CardOverflow,
  Button,
  ButtonSkeleton,
  CardOverlay,
} from '@ui/components';
import {
  EventHero,
  EventHeroSkeleton,
  type EventHeroProps,
} from '../../molecules/EventHero/EventHero';
import {
  EventDetails,
  EventDetailsSkeleton,
  type EventDetailsProps,
} from '../../molecules/EventDetails/EventDetails';
import {
  EventFooterClient,
  type EventFooterClientProps,
} from './EventFooterClient';

export interface EventProps
  extends EventHeroProps,
    EventDetailsProps,
    EventFooterClientProps {
  id: string;
  slug: string;
}

export const Event: React.FC<EventProps> = ({
  description,
  purchaseLink,
  purchaseText,
  ...eventHeroProps
}) => {
  return (
    <Card variant="stickyFooter" noBorder className="w-full">
      <CardOverflow>
        <CardHeader>
          <EventHero {...eventHeroProps} />
        </CardHeader>
        <EventDetails className="md:mt-4" description={description} />
      </CardOverflow>
      <CardOverlay />
      <CardFooter className="justify-center" variant="sticky">
        <EventFooterClient
          purchaseLink={purchaseLink}
          purchaseText={purchaseText}
        />
      </CardFooter>
    </Card>
  );
};

export const EventSkeleton: React.FC = () => {
  return (
    <Card variant="stickyFooter" noBorder className="w-full">
      <CardHeader>
        <EventHeroSkeleton />
      </CardHeader>
      <EventDetailsSkeleton className="md:mt-4" />
      <CardFooter variant="sticky" className="justify-center">
        <ButtonSkeleton className="w-full md:w-1/6" />
      </CardFooter>
    </Card>
  );
};
