import { AuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser, AppNavLayout } from '@features/appNav/ui';
import { NoUserPass } from './NoUserPass';

export function NoUserPassExample() {
  return (
    <AuthProvider>
      <AppNavLayout {...WithNoUser.args} children={<NoUserPass />} />{' '}
    </AuthProvider>
  );
}
