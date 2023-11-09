import { AuthProvider, NextAuthProvider, SafeUser } from '@next/auth';
import { useTranslations } from 'next-intl';
import { ProfileNav, ProfileNavProps } from './ProfileNav';
import { ProfileNavClient } from './ProfileNavClient';

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

export function ProfileNavExample(props: ProfileNavProps) {
  return (
    <div className="flex">
      <ProfileNav {...props} />{' '}
    </div>
  );
}

export const user = {
  eoa: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
  safes: [],
  email: 'johndoe@example.com',
  name: 'John Doe',
  profileImage: 'https://robohash.org/johndoe.png?size=96x96',
} satisfies SafeUser;
