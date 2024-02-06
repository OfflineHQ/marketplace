import { AuthProvider, NextAuthProvider } from '@next/auth';
import type { AppUser } from '@next/types';
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
              createAccount: t('sections-text.create-account'),
              createAccountTitle: t('sections-text.create-account-title'),
              createAccountDescription: t(
                'sections-text.create-account-description',
              ),
              dontHaveAnAccount: t('sections-text.dont-have-an-account'),
              settings: t('sections-text.settings'),
              copiedAddress: t('sections-text.copied-address'),
              switchToMyAccount: t('sections-text.switch-to-my-account'),
              myCurrentRole: t('sections-text.my-current-role'),
              switchToRole: t('sections-text.switch-to-role'),
              switchToRoleToastTitle: t(
                'sections-text.switch-to-role-toast-title',
              ),
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
              verifyEmail: t('sections-text.verify-email'),
              verifyEmailContinue: t('sections-text.verify-email-continue'),
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
  signOut: 'Sign Out',
  signOutTitle: 'Sign Out',
  signOutDescription: 'Sign Out description',
  signIn: 'Sign In',
  createAccount: 'Sign Up',
  createAccountTitle: 'Account created',
  createAccountDescription: 'Create Account description',
  dontHaveAnAccount: 'Don’t have an account?',
  settings: 'Settings',
  copiedAddress: 'Copied address!',
  switchToMyAccount: 'Switch to my account',
  myCurrentRole: 'My current role',
  switchToRole: 'Switch to role',
  switchToRoleToastTitle: 'Switched to role:',
  switchToRoleToastErrorTitle: 'Error while trying to switch to role',
  switchToMyAccountToastErrorTitle:
    'Error while trying to switch to your account',
  switchToMyAccountToastTitle: 'User account',
  switchToMyAccountToastTDescription:
    'You are now connected with your own account',
  verifyEmail: 'Verify my email',
} as ProfileNavClientProps['profileSectionsText'];

export const user = {
  id: '1',
  address: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
  email: 'johndoe@example.com',
} satisfies AppUser;

const commonProps = {
  profileSectionsText,
  user,
  login: () => null,
  signOutUserAction: () => null,
  switchToRole: () => null,
  switchToMyAccount: () => null,
  createAccountAction: () => null,
  verifyEmail: () => null,
  toast,
};

export const itemsNotConnected: ProfileNavProps['items'] = constructItems({
  ...commonProps,
  user: undefined,
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

export const itemsSuperAdmin: ProfileNavProps['items'] = constructItems({
  ...commonProps,
  roles: [organizerRoleAdmin, organizerRoleSuperAdmin],
  matchingRole: organizerRoleSuperAdmin,
});
