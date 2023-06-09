import { AuthProvider, NextAuthProvider } from '@client/auth';
import { WithNoUser } from '@features/appNav/ui/stories';
import { EventPassesSkeleton } from '../EventPasses/EventPasses';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserCart } from './NoUserCart';
import {
  SetupPassesCartLocal,
  FakeEventPassesFetcher,
} from '../EventPassList/examples';

export function NoUserCartExample() {
  SetupPassesCartLocal();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart EventPassesFetcher={FakeEventPassesFetcher} />
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
          <NoUserCart EventPassesFetcher={EventPassesSkeleton} />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function NoUserCartNoCartExample() {
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart EventPassesFetcher={FakeEventPassesFetcher} />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
