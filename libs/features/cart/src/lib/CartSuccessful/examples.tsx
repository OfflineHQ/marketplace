import { AppNavLayout } from '@features/appNav/ui';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { CartSuccessful, type CartSuccessfulProps } from './CartSuccessful';

export const CartSuccessfulExample = (props: CartSuccessfulProps) => {
  return (
    <AppNavLayout {...WithNormalUser.args}>
      <CartSuccessful {...props} />
    </AppNavLayout>
  );
};
