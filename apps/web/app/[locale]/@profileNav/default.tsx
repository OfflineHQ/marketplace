import { useLocale } from 'next-intl';
import { getTranslator } from 'next-intl/server';
import { ProfileNavClient } from './ProfileNavClient';
import { isConnected } from '@next/next-auth/user';

export default async function ProfileNavSection() {
  const locale = useLocale();
  const t = await getTranslator(locale, 'AppNav.Profile');
  const isNextAuthConnected = await isConnected();
  return (
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
    />
  );
}
