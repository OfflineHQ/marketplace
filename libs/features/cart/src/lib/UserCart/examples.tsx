import { AppNavLayout } from '@features/appNav/ui';
import { WithNormalUser } from '@features/appNav/ui/stories';
import type { Locale } from '@gql/shared/types';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { accounts } from '@test-utils/gql';
import { Button } from '@ui/components';
import { useLocale, useTranslations } from 'next-intl';
import {
  FakeEventPassesFetcher,
  SetPassesCartLocal,
} from '../EventPassList/examples';
import { EventPassesSkeleton } from '../EventPasses/EventPasses';
import { UserCartSection, type UserCartSectionProps } from './UserCartSection';
// @ts-ignore
import EmptyCartImage from '../images/empty-cart.svg';

function RenderUserCart({
  EventPassesFetcher,
  user,
}: Pick<UserCartSectionProps, 'EventPassesFetcher' | 'user'>) {
  const t = useTranslations('Cart.UserCart');
  const locale = useLocale();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNormalUser.args}>
          <UserCartSection
            EventPassesFetcher={EventPassesFetcher}
            noCartImage={EmptyCartImage}
            locale={locale as Locale}
            user={user}
          >
            <Button>{t('finalize-button')}</Button>
          </UserCartSection>
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function UserCartExample() {
  SetPassesCartLocal();
  return (
    <RenderUserCart
      EventPassesFetcher={FakeEventPassesFetcher}
      user={accounts.alpha_user}
    />
  );
}

export function UserCartLoadingExample() {
  SetPassesCartLocal();
  return (
    <RenderUserCart
      EventPassesFetcher={EventPassesSkeleton}
      user={accounts.alpha_user}
    />
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
