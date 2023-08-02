import { EventPasses, type EventPassesProps } from './EventPasses';
import { Accordion } from '@ui/components';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
  eventProps,
  event2Props,
} from '@features/organizer/event/examples';
import type { EventCart } from '@features/cart-types';

export const eventPassesCart: EventPassesProps['passes'] = [
  { ...passWithMaxAmountCart, amount: 1 },
  { ...passWithMaxAmountPerUserCart, amount: 2 },
];

export const eventCartProps: EventCart = {
  ...eventProps,
  eventPasses: [passWithMaxAmount, passWithMaxAmountPerUser],
};

export const eventPassesProps: EventPassesProps = {
  event: eventCartProps,
  onDelete: ({ organizerSlug, eventSlug }) => null,
  passes: eventPassesCart,
};

export const EventPassesExample = (props: EventPassesProps) => {
  return (
    <Accordion type="multiple">
      <EventPasses {...props} />
    </Accordion>
  );
};
