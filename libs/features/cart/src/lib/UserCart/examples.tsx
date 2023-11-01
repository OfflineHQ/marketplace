import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { Button } from '@ui/components';
import { useTranslations } from 'next-intl';
import { UserCart, UserCartProps } from './UserCart';

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
