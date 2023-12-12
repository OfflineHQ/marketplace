import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';

import { CartSuccessful, type CartSuccessfulProps } from './CartSuccessful';

import {
  passFamilyCart,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
} from '@features/organizer/event/examples';

import { UserPassOrder } from '@features/cart-types';
import { event2Props, eventProps } from '@features/organizer/event/examples';

export const passOrder1 = {
  ...passWithMaxAmountCart,
  eventPass: {
    event: eventProps,
  },
} satisfies UserPassOrder;

export const passOrder2 = {
  ...passWithMaxAmountPerUserCart,
  eventPass: {
    event: eventProps,
  },
} satisfies UserPassOrder;

export const passOrderWithEvent2 = {
  ...passFamilyCart,
  eventPass: {
    event: event2Props,
  },
} satisfies UserPassOrder;

export const CartSuccessfulExample = (props: CartSuccessfulProps) => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <CartSuccessful {...props} />
    </AppNavLayout>
  );
};
