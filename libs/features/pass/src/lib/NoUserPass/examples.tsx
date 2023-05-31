import { AuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserPass } from './NoUserPass';

export function NoUserPassExample() {
  return (
    <AuthProvider>
      <AppNavLayout {...WithNoUser.args} children={<NoUserPass />} />{' '}
    </AuthProvider>
  );
}
