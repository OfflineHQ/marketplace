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
import {
  EventPassCardContent,
  type EventPassCardContentProps,
} from '../EventPassCardContent/EventPassCardContent';

import { useTranslations } from 'next-intl';
import { EventPassCardFooter } from '../../molecules/EventPassCardFooter/EventPassCardFooter';

export type EventPassCardProps = EventPassCardContentProps;

export const EventPassCard = ({ eventPass, ...props }: EventPassCardProps) => {
  const t = useTranslations('OrganizerEvents.Sheet.EventPassCard');
  return (
    <Card className="flex flex-col" key={eventPass.id} variant="distinct">
      <CardHeader className="space-y-4">
        <CardTitle>{eventPass.name}</CardTitle>
        <CardDescription>{eventPass.description}</CardDescription>
      </CardHeader>
      <EventPassCardContent eventPass={eventPass} {...props} />
      <EventPassCardFooter eventPass={eventPass} />
    </Card>
  );
};

export const EventPassCardSkeleton = () => {
  return (
    <Card className="flex flex-col" variant="distinct">
      <CardHeader className="space-y-4">
        <CardTitleSkeleton color="highlight" />
        <CardDescriptionSkeleton color="highlight" />
      </CardHeader>
      <CardContent>
        <AccordionSkeleton numItems={2} color="highlight" />
      </CardContent>
      <CardFooter>
        <ButtonSkeleton className="w-full" color="highlight" />
      </CardFooter>
    </Card>
  );
};
