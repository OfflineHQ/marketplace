import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { UserPassPendingOrder } from '@features/cart-types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Button } from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { passOrder1, passOrderWithEvent2 } from '../CartSuccessful/examples';
import { UserCart, UserCartProps } from './UserCart';
import { allPassesCart } from '../NoUserCart/examples';

export const userPassPendingOrders1: UserPassPendingOrder[] = [
  passOrder1,
  passOrderWithEvent2,
];

export const allPassesCartUser = allPassesCart;

export function UserCartExample(args: UserCartProps) {
  const t = useTranslations('Cart.UserCart');
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => true}>
        <AppNavLayout {...WithNormalUser.args}>
          <UserCart {...args} noCartImage="/empty-cart.svg">
            <Button block className="w-full md:w-1/6" icon={<Cart />}>
              {t('finalize-button')}
            </Button>
          </UserCart>
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
