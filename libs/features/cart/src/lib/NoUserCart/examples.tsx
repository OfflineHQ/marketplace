import { AppNavLayout } from '@features/app-nav';
import { WithNoUser } from '@features/app-nav/stories';
import { PassCache } from '@features/pass-cache';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { EventPassListSkeleton } from '../EventPassList/EventPassList';
import { NoUserCart } from './NoUserCart';

export function NoUserCartExample(passCache: PassCache) {
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => false}>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart noCartImage="/empty-cart.svg" />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function NoUserCartLoadingExample() {
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => false}>
        <AppNavLayout {...WithNoUser.args}>
          <EventPassListSkeleton />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
