import { AuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser, AppNavLayout } from '@features/appNav/ui';
import { NoUserCart } from './NoUserCart';

export function NoUserCartExample() {
  return (
    <AuthProvider>
      <AppNavLayout {...WithNoUser.args} children={<NoUserCart />} />{' '}
    </AuthProvider>
  );
}
