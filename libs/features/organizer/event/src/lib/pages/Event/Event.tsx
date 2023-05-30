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
    EventFooterClientProps {}

export const Event: React.FC<EventProps> = ({
  description,
  purchaseLink,
  purchaseText,
  detailsTitle,
  ...eventHeroProps
}) => {
  return (
    <Card variant="stickyFooter" noBorder>
      <CardOverflow>
        <CardHeader>
          <EventHero {...eventHeroProps} />
        </CardHeader>
        <EventDetails description={description} detailsTitle={detailsTitle} />
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
      <EventDetailsSkeleton />
      <CardFooter variant="sticky" className="justify-center">
        <ButtonSkeleton className="w-full md:w-1/6" />
      </CardFooter>
    </Card>
  );
};
