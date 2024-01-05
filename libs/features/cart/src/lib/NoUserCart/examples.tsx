import { AppNavLayout } from '@features/app-nav';
import { WithNoUser } from '@features/app-nav/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { NoUserCart } from './NoUserCart';

export function NoUserCartExample(args: any) {
  return (
    <NextAuthProvider session={null}>
      <AuthProvider session={null} isConnected={() => false}>
        <AppNavLayout {...WithNoUser.args}>
          <NoUserCart {...args} noCartImage="/empty-cart.svg" />
        </AppNavLayout>
      </AuthProvider>
    </NextAuthProvider>
  );
}
