import { useTranslations } from 'next-intl';
import { AuthProvider } from '@client/auth';
import { ProfileNavClient } from './ProfileNavClient';

export default function ProfileNavSection() {
  const t = useTranslations('AppNav.Profile');
  return (
    <AuthProvider>
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
      />
    </AuthProvider>
  );
}
