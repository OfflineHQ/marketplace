import {
  AppContainer,
  AppContainerFooter,
  AppContainerOverflow,
} from '@features/app-nav';
import { ButtonSkeleton, CardFooter, CardHeader } from '@ui/components';
import {
  EventDetails,
  EventDetailsSkeleton,
  type EventDetailsProps,
} from '../../molecules/EventDetails/EventDetails';
import {
  EventHero,
  EventHeroSkeleton,
  type EventHeroProps,
} from '../../molecules/EventHero/EventHero';
import { EventFooter, type EventFooterProps } from './EventFooter';

export interface EventProps
  extends EventHeroProps,
    EventDetailsProps,
    EventFooterProps {
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
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader>
          <EventHero {...eventHeroProps} {...{ purchaseLink, purchaseText }} />
        </CardHeader>
        <EventDetails className="md:mt-4" description={description} />
      </AppContainerOverflow>
      <AppContainerFooter>
        <EventFooter purchaseLink={purchaseLink} purchaseText={purchaseText} />
      </AppContainerFooter>
    </AppContainer>
  );
};

export const EventSkeleton: React.FC = () => {
  return (
    <AppContainer>
      <AppContainerOverflow variant="stickyFooter">
        <CardHeader>
          <EventHeroSkeleton />
        </CardHeader>
        <EventDetailsSkeleton className="md:mt-4" />
      </AppContainerOverflow>
      <CardFooter variant="sticky" className="justify-center">
        <ButtonSkeleton className=" w-full md:w-1/6" />
      </CardFooter>
    </AppContainer>
  );
};
