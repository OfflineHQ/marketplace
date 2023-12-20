import {
  AccordionSkeleton,
  ButtonSkeleton,
  Card,
  CardContent,
  CardDescription,
  CardDescriptionSkeleton,
  CardFooter,
  CardHeader,
  CardTitle,
  CardTitleSkeleton,
} from '@ui/components';

import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { useTranslations } from 'next-intl';
import { EventPassTypeBadge } from '../../atoms/EventPassTypeBadge/EventPassTypeBadge';
import { getEventPassType } from '../../common/getEventPassType';
import { EventPassCardFooter } from '../../molecules/EventPassCardFooter/EventPassCardFooter';
import { EventPassCardContentDelayedReveal } from '../EventPassCardContentDelayedReveal/EventPassCardContentDelayedReveal';
import {
  EventPassCardContentNormal,
  type EventPassCardContentNormalProps,
} from '../EventPassCardContentNormal/EventPassCardContentNormal';

export type EventPassCardProps = Omit<EventPassCardContentNormalProps, 'title'>;

export const EventPassCard = ({
  eventPass,
  event,
  organizerId,
  ...props
}: EventPassCardProps) => {
  const t = useTranslations('OrganizerEvents.Sheet.EventPassCard');
  const type = getEventPassType(eventPass);
  return (
    <Card className="flex h-fit flex-col" key={eventPass.id} variant="distinct">
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-baseline justify-between space-x-1">
          {eventPass.name}
          <EventPassTypeBadge type={type} className="self-baseline" />
        </CardTitle>
        <CardDescription>{eventPass.description}</CardDescription>
      </CardHeader>
      {type === EventPassNftContractType_Enum.Normal ? (
        <EventPassCardContentNormal
          eventPass={eventPass}
          event={event}
          organizerId={organizerId}
          {...props}
        />
      ) : (
        <EventPassCardContentDelayedReveal
          eventPass={eventPass}
          event={event}
          organizerId={organizerId}
          {...props}
        />
      )}
      <EventPassCardFooter
        eventPass={eventPass}
        organizerId={organizerId}
        eventId={event.id}
        eventPassId={eventPass.id}
        eventSlug={event.slug}
        eventPassType={type}
      />
    </Card>
  );
};

export const EventPassCardSkeleton = () => {
  return (
    <Card className="flex flex-col" variant="distinct">
      <CardHeader className="space-y-4">
        <CardTitleSkeleton />
        <CardDescriptionSkeleton />
      </CardHeader>
      <CardContent>
        <AccordionSkeleton numItems={2} />
      </CardContent>
      <CardFooter>
        <ButtonSkeleton className="w-full" />
      </CardFooter>
    </Card>
  );
};
