import { AppNavLayout } from '@features/app-nav';
import { WithNoUser } from '@features/app-nav/stories';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { useTranslations } from 'next-intl';
import { NoUserPass } from './NoUserPass';
// @ts-ignore

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
              noPassImage="/empty-pass.svg"
            >
              {''}
            </NoUserPass>
          }
        />
      </AuthProvider>
    </NextAuthProvider>
  );
}
