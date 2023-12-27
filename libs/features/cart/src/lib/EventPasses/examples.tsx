import type { EventCart } from '@features/cart-types';
import {
  eventProps,
  passWithMaxAmount,
  passWithMaxAmountCart,
  passWithMaxAmountPerUser,
  passWithMaxAmountPerUserCart,
} from '@features/organizer/event/examples';
import { Currency_Enum } from '@gql/shared/types';
import { Accordion } from '@ui/components';
import { EventPasses, type EventPassesProps } from './EventPasses';

const passPending1 = {
  ...passWithMaxAmountCart,
  created_at: '2023-06-05T00:00:00Z',
} satisfies EventPassesProps['passes'][0];

const passPending2 = {
  ...passWithMaxAmountPerUserCart,
  created_at: '2023-06-04T20:29:00Z',
} satisfies EventPassesProps['passes'][0];

export const eventPassesCart: EventPassesProps['passes'] = [
  passPending1,
  passPending2,
];

export const eventCartProps: EventCart = {
  ...eventProps,
  eventPasses: [
    {
      ...passWithMaxAmount,
      passAmount: {
        maxAmount: 7,
        timeBeforeDelete: 14400,
      },
      passPricing: {
        currency: Currency_Enum.Usd,
        amount: 130000,
      },
    },
    {
      ...passWithMaxAmountPerUser,
      passAmount: {
        maxAmountPerUser: 3,
        maxAmount: 30,
        timeBeforeDelete: 14400,
      },
      passPricing: {
        currency: Currency_Enum.Usd,
        amount: 250000,
      },
    },
  ],
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
