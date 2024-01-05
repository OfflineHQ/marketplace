import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { UserPassPendingOrder } from '@features/cart-types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Button } from '@ui/components';
import { Cart } from '@ui/icons';
import { useTranslations } from 'next-intl';
import { passOrder1, passOrderWithEvent2 } from '../CartSuccessful/examples';
import { UserCart, UserCartProps } from './UserCart';

export const userPassPendingOrders1: UserPassPendingOrder[] = [
  passOrder1,
  passOrderWithEvent2,
];

export function UserCartExample({
  userPassPendingOrders,
}: Pick<UserCartProps, 'userPassPendingOrders'>) {
  const t = useTranslations('Cart.UserCart');
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => true}>
        <AppNavLayout {...WithNormalUser.args}>
          <UserCart
            noCartImage="/empty-cart.svg"
            userPassPendingOrders={userPassPendingOrders}
          >
            <Button block className="w-full md:w-1/6" icon={<Cart />}>
              {t('finalize-button')}
            </Button>
          </UserCart>
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
