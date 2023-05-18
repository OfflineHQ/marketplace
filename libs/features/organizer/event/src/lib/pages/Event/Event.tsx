import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Button,
  ButtonSkeleton,
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
  ...eventHeroProps
}) => {
  return (
    <Card>
      <CardHeader>
        <EventHero {...eventHeroProps} />
      </CardHeader>
      <CardContent>
        <EventDetails description={description} />
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={buyFunction} className="w-full md:w-1/2" icon={QrCode}>
          {buyText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export const EventSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <EventHeroSkeleton />
      </CardHeader>
      <CardContent>
        <EventDetailsSkeleton />
      </CardContent>
      <CardFooter className="justify-center">
        <ButtonSkeleton className="w-full md:w-1/2" />
      </CardFooter>
    </Card>
  );
};
