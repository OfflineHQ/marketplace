import {
  ProfileNavClient,
  ProfileNavSkeleton,
} from '@features/back-office/app-nav';
import { getMyRolesWithOrganizerInfos } from '@features/back-office/roles-api';
import { messages } from '@next/i18n';
import { getCurrentUser } from '@next/next-auth/user';
import { deepPick } from '@utils';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';

interface ProfileNavSectionProps {
  params: {
    locale: string;
  };
}

export default async function ProfileNavSection({
  params: { locale },
}: ProfileNavSectionProps) {
  return (
    <Suspense fallback={<ProfileNavSkeleton />}>
      <ProfileNavSectionContent locale={locale} />
    </Suspense>
  );
}

async function ProfileNavSectionContent({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'AppNav.Profile' });
  const user = await getCurrentUser();
  let roles;
  if (user) roles = await getMyRolesWithOrganizerInfos();
  // Roles.RoleBadge
  const localeMessages = deepPick(messages[locale], ['Roles.RoleBadge']);
  return (
    <NextIntlClientProvider locale={locale} messages={localeMessages}>
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
          copiedAddress: t('sections-text.copied-address'),
          switchToMyAccount: t('sections-text.switch-to-my-account'),
          myCurrentRole: t('sections-text.my-current-role'),
          switchToRole: t('sections-text.switch-to-role'),
          switchToRoleToastTitle: t('sections-text.switch-to-role-toast-title'),
          switchToRoleToastErrorTitle: t(
            'sections-text.switch-to-role-toast-error-title',
          ),
          switchToMyAccountToastErrorTitle: t(
            'sections-text.switch-to-my-account-toast-error-title',
          ),
          switchToMyAccountToastTitle: t(
            'sections-text.switch-to-my-account-toast-title',
          ),
          switchToMyAccountToastTDescription: t(
            'sections-text.switch-to-my-account-toast-description',
          ),
        }}
        isNextAuthConnected={!!user}
        roles={roles}
        account={user}
      />
    </NextIntlClientProvider>
  );
}
