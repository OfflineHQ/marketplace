import { AppNavLayout } from '@features/appNav/ui';
import { WithNoUser } from '@features/appNav/ui/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { NoUserCart } from './NoUserCart';

export function NoUserCartExample() {
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
          <NoUserCart noCartImage="/empty-cart.svg" />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}

export function NoUserCartNoCartExample() {
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
