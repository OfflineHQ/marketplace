import { AppNavLayout } from '@features/app-nav';
import { WithNoUser } from '@features/app-nav/stories';
import { AllPassesCart } from '@features/cart-types';
import {
  event2Props,
  eventProps,
  passFamilyCart,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
} from '@features/organizer/event/examples';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { NoUserCart } from './NoUserCart';

export const allPassesCart = {
  [eventProps.organizer.slug]: {
    [eventProps.slug]: [passWithMaxAmountCart, passWithMaxAmountPerUserCart],
  },
  [event2Props.organizer.slug]: {
    [event2Props.slug]: [passFamilyCart],
  },
} satisfies AllPassesCart;

export function NoUserCartExample(args: any) {
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => false}>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart {...args} noCartImage="/empty-cart.svg" />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
