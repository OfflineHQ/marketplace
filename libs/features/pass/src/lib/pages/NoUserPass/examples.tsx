import { AuthProvider, NextAuthProvider } from '@next/auth';
import { WithNoUser, WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';
import { NoUserPass } from './NoUserPass';
import { useTranslations } from 'next-intl';
// @ts-ignore
import EmptyPassImage from '../UserPass/empty-pass.svg';

export function NoUserPassExample() {
  const t = useTranslations('Pass.NoUserPass');
  return (
    <NextAuthProvider>
      <AuthProvider>
        <AppNavLayout
          {...WithNoUser.args}
          children={
            <NoUserPass
              title={t('title')}
              description={t('description')}
              signInText={t('sign-in-text')}
              noPassImage={EmptyPassImage}
            >
              {''}
            </NoUserPass>
          }
        />
      </AuthProvider>
    </NextAuthProvider>
  );
}
