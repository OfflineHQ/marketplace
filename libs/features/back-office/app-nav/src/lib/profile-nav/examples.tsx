import { AuthProvider, NextAuthProvider, SafeUser } from '@next/auth';
import { toast } from '@ui/components';
import { useTranslations } from 'next-intl';
import {
  organizerRoleAdmin,
  organizerRoleSuperAdmin,
} from '../role-avatar/examples';
import { ProfileNav, ProfileNavProps } from './ProfileNav';
import {
  ProfileNavClient,
  ProfileNavClientProps,
  constructItems,
} from './ProfileNavClient';

export function ProfileNavClientExample(props: ProfileNavClientProps) {
  const t = useTranslations('AppNav.Profile');
  return (
    <div className="flex">
      <NextAuthProvider session={null}>
        <AuthProvider session={null} isConnected={() => true}>
          <ProfileNavClient
            {...props}
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
            }}
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

const profileSectionsText = {
  myAccount: 'My account',
  support: 'Support',
  supportTitle: 'Support',
  supportDescription: 'Support description',
  signOut: 'Sign out',
  signOutTitle: 'Sign out',
  signOutDescription: 'Sign out description',
  signIn: 'Sign in',
  settings: 'Settings',
  copiedAddress: 'Copied address!',
} as ProfileNavClientProps['profileSectionsText'];

export const user = {
  eoa: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
  safes: [],
  email: 'johndoe@example.com',
  name: 'John Doe',
  profileImage: 'https://robohash.org/johndoe.png?size=96x96',
} satisfies SafeUser;

const commonProps = {
  profileSectionsText,
  safeUser: user,
  login: () => null,
  signOutUserAction: () => null,
  switchToRole: () => null,
  switchToMyAccount: () => null,
  toast,
};

export const itemsNotConnected: ProfileNavProps['items'] = constructItems({
  ...commonProps,
  safeUser: undefined,
});

export const itemsUserNoRoles: ProfileNavProps['items'] = constructItems({
  ...commonProps,
});

export const itemsUserWithRoles: ProfileNavProps['items'] = constructItems({
  ...commonProps,
  roles: [organizerRoleAdmin, organizerRoleSuperAdmin],
});

export const itemsAdmin: ProfileNavProps['items'] = constructItems({
  ...commonProps,
  roles: [organizerRoleAdmin, organizerRoleSuperAdmin],
  matchingRole: organizerRoleAdmin,
});
