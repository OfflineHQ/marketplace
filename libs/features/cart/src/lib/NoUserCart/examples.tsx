import { AppNavLayout } from '@features/appNav/ui';
import { WithNoUser } from '@features/appNav/ui/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import {
  FakeEventPassesFetcher,
  ResetPassesCartLocal,
  SetPassesCartLocal,
} from '../EventPassList/examples';
import { EventPassesSkeleton } from '../EventPasses/EventPasses';
import { NoUserCart } from './NoUserCart';
// @ts-ignore
import EmptyCartImage from '../images/empty-cart.svg';

export function NoUserCartExample() {
  SetPassesCartLocal();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart
            EventPassesFetcher={FakeEventPassesFetcher}
            noCartImage={EmptyCartImage}
          />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function NoUserCartLoadingExample() {
  SetPassesCartLocal();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart
            EventPassesFetcher={EventPassesSkeleton}
            noCartImage={EmptyCartImage}
          />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function NoUserCartNoCartExample() {
  ResetPassesCartLocal();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart
            EventPassesFetcher={FakeEventPassesFetcher}
            noCartImage={EmptyCartImage}
          />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
