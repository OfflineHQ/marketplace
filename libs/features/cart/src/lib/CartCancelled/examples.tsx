import { AppNavLayout } from '@features/app-nav';
import { WithUserEmail } from '@features/app-nav/stories';

import { CartCancelled, type CartCancelledProps } from './CartCancelled';

export {
  passOrder1,
  passOrder2,
  passOrderWithEvent2,
} from '../CartSuccessful/examples';

export const CartCancelledExample = (props: CartCancelledProps) => {
  return (
    <AppNavLayout {...WithUserEmail.args}>
      <CartCancelled {...props} />
    </AppNavLayout>
  );
};
