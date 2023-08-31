import { AuthProvider, NextAuthProvider } from '@next/auth';
import { WithNoUser } from '@features/appNav/ui/stories';
import { EventPassesSkeleton } from '../EventPasses/EventPasses';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserCart } from './NoUserCart';
import {
  SetupPassesCartLocal,
  ResetPassesCartLocal,
  FakeEventPassesFetcher,
} from '../EventPassList/examples';
// @ts-ignore
import EmptyCartImage from './empty-cart.svg';

export function NoUserCartExample() {
  SetupPassesCartLocal();
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
  SetupPassesCartLocal();
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
