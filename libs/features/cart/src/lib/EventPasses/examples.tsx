import type { EventCart } from '@features/cart-types';
import {
  eventProps,
  passWithMaxAmount,
  passWithMaxAmountCart,
  passWithMaxAmountPerUser,
  passWithMaxAmountPerUserCart,
} from '@features/organizer/event/examples';
import { Accordion } from '@ui/components';
import { EventPasses, type EventPassesProps } from './EventPasses';

export const eventPassesCart: EventPassesProps['passes'] = [
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
];

export const eventCartProps: EventCart = {
  ...eventProps,
  eventPasses: [passWithMaxAmount, passWithMaxAmountPerUser],
};

export const eventPassesProps: EventPassesProps = {
  event: eventCartProps,
  passes: eventPassesCart,
};

export const EventPassesExample = (props: EventPassesProps) => {
  return (
    <Accordion type="multiple">
      <EventPasses {...props} />
    </Accordion>
  );
};
