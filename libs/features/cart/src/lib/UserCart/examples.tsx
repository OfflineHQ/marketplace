import { AppNavLayout } from '@features/appNav/ui';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Button } from '@ui/components';
import { useTranslations } from 'next-intl';
import { UserCart, UserCartProps } from './UserCart';
// @ts-ignore
import EmptyCartImage from '../images/empty-cart.svg';

export function UserCartExample({
  userPassPendingOrders,
}: Pick<UserCartProps, 'userPassPendingOrders'>) {
  const t = useTranslations('Cart.UserCart');
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => true}>
        <AppNavLayout {...WithNormalUser.args}>
          <UserCart
            noCartImage={EmptyCartImage}
            userPassPendingOrders={userPassPendingOrders}
          >
            <Button>{t('finalize-button')}</Button>
          </UserCart>
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

// export function UserCartNoCartExample() {
//   ResetPassesCartLocal();
//   return (
//     <NextAuthProvider>
//       <AuthProvider>
//         <AppNavLayout {...WithNoUser.args}>
//           <UserCartSection
//             EventPassesFetcher={FakeEventPassesFetcher}
//             noCartImage={EmptyCartImage}
//           />
//         </AppNavLayout>
//       </AuthProvider>
//     </NextAuthProvider>
//   );
// }
