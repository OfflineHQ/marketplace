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
