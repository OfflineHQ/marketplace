import { EventPasses, type EventPassesProps } from './EventPasses';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@ui/components';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
  eventProps,
} from '@features/organizer/event/examples';

export const eventPassesProps: EventPassesProps = {
  event: eventProps,
  onDelete: ({ organizerSlug, eventSlug }) => null,
  passes: [passWithMaxAmount, passWithMaxAmountPerUser],
};

export const EventPassesExample = (props: EventPassesProps) => {
  return (
    <Accordion type="multiple">
      <EventPasses {...props} />
    </Accordion>
  );
};
