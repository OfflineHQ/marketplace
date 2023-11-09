import {
  ProfileNavClient,
  ProfileNavSkeleton,
} from '@features/back-office/app-nav';
import { getMyRolesWithOrganizerInfos } from '@features/back-office/roles-api';
import { getCurrentUser } from '@next/next-auth/user';
import { getTranslator } from 'next-intl/server';
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
  const t = await getTranslator(locale, 'AppNav.Profile');
  const user = await getCurrentUser();
  let roles;
  if (user) roles = await getMyRolesWithOrganizerInfos();
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
      isNextAuthConnected={!!user}
      roles={roles}
      account={user}
    />
  );
}
