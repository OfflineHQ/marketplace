import { ProfileNavClient } from '@features/app-nav';
import { getCurrentUser, isConnected } from '@next/next-auth/user';
import { useLocale } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default async function ProfileNavSection() {
  const locale = useLocale();
  const t = await getTranslations({ locale, namespace: 'AppNav.Profile' });
  const user = await getCurrentUser();
  const isNextAuthConnected = await isConnected();
  return (
    <ProfileNavClient
      signInText={t('sign-in')}
      accountPlaceholder={t('account-placeholder')}
      profileSectionsText={{
        myAccount: t('sections-text.my-account'),
        support: t('sections-text.support'),
        supportTitle: t('sections-text.support-title'),
        supportDescription: t('sections-text.support-description'),
        signOut: t('sections-text.sign-out'),
        signOutTitle: t('sections-text.sign-out-title'),
        signOutDescription: t('sections-text.sign-out-description'),
        signIn: t('sections-text.sign-in'),
        createAccount: t('sections-text.create-account'),
        createAccountTitle: t('sections-text.create-account-title'),
        createAccountDescription: t('sections-text.create-account-description'),
        dontHaveAnAccount: t('sections-text.dont-have-an-account'),
        settings: t('sections-text.settings'),
        verifyEmail: t('sections-text.verify-email'),
        verifyEmailContinue: t('sections-text.verify-email-continue'),
      }}
      isNextAuthConnected={isNextAuthConnected}
      account={user}
    />
  );
}
