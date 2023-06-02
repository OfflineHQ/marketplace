import { AuthProvider, NextAuthProvider } from '@client/auth';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserPass } from './NoUserPass';

export function NoUserPassExample() {
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout {...WithNoUser.args} children={<NoUserPass />} />
      </AuthProvider>
    </NextAuthProvider>
  );
}
