import { ProfileNavClient } from './ProfileNavClient';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { useTranslations } from 'next-intl';

export function ProfileNavClientExample({ isNextAuthConnected = false }) {
  const t = useTranslations('AppNav.Profile');
  return (
    <div className="flex">
      <NextAuthProvider session={null}>
        <AuthProvider session={null} isConnected={() => true}>
          <ProfileNavClient
            signInText={t('sign-in')}
            profileSectionsText={{
              myAccount: t('sections-text.my-account'),
              support: t('sections-text.support'),
              supportTitle: t('sections-text.support-title'),
              supportDescription: t('sections-text.support-description'),
              signOut: t('sections-text.sign-out'),
              signOutTitle: t('sections-text.sign-out-title'),
              signOutDescription: t('sections-text.sign-out-description'),
              signIn: t('sections-text.sign-in'),
              settings: t('sections-text.settings'),
            }}
            isNextAuthConnected={isNextAuthConnected}
          />{' '}
        </AuthProvider>
      </NextAuthProvider>
    </div>
  );
}
