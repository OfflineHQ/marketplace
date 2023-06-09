import { AuthProvider, NextAuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserCart } from './NoUserCart';
import {
  SetupPassesCartLocal,
  FakeEventPassesServer,
  FakeEventPassesServerLoading,
} from '../LocalPassList/examples';

export function NoUserCartExample() {
  SetupPassesCartLocal();
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart EventPassServer={FakeEventPassesServer} />
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
          <NoUserCart EventPassServer={FakeEventPassesServerLoading} />
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
          <NoUserCart EventPassServer={FakeEventPassesServer} />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
