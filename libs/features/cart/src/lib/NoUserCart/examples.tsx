import { AuthProvider, NextAuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserCart } from './NoUserCart';

export function NoUserCartExample() {
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args} children={<NoUserCart />} />{' '}
      </AuthProvider>
    </NextAuthProvider>
  );
}
