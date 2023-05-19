import {
  Card,
  CardHeader,
  CardContent,
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
import { QrCode } from '@ui/icons';

export interface EventProps extends EventHeroProps, EventDetailsProps {
  buyFunction: () => void;
  buyText: string;
}

export const Event: React.FC<EventProps> = ({
  description,
  buyFunction,
  buyText,
  detailsTitle,
  ...eventHeroProps
}) => {
  return (
    <Card variant="stickyFooter">
      <CardOverflow>
        <CardHeader>
          <EventHero {...eventHeroProps} />
        </CardHeader>
        <EventDetails description={description} detailsTitle={detailsTitle} />
      </CardOverflow>
      <CardOverlay />
      <CardFooter className="justify-center" variant="sticky">
        <Button onClick={buyFunction} className="w-full md:w-1/2" icon={QrCode}>
          {buyText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const EventSkeleton: React.FC = () => {
  return (
    <Card variant="stickyFooter">
      <CardHeader>
        <EventHeroSkeleton />
      </CardHeader>
      <EventDetailsSkeleton />
      <CardFooter variant="sticky" className="justify-center">
        <ButtonSkeleton className="w-full md:w-1/2" />
      </CardFooter>
    </Card>
  );
};
