import { AuthProvider, NextAuthProvider } from '@next/auth';
import { LifeBuoy, LogIn, LogOut, Settings, User } from '@ui/icons';
import { useTranslations } from 'next-intl';
import {
  cryptoUserSession,
  normalUserSession,
} from '../profile-avatar/examples';
import { ProfileNav, ProfileNavProps } from './ProfileNav';
import { ProfileNavClient } from './ProfileNavClient';
import { AppUser } from '@next/types';

export const user = {
  id: '1',
  address: '0x1bBEdB07706728A19c9dB82d3c420670D8040592',
  email: 'johndoe@example.com',
} satisfies AppUser;

export const cryptoUserMenuItems = [
  { type: 'label', text: 'My Account', className: 'pt-2 pb-0' },
  {
    type: 'children',
    children: (
      <div className="overflow-hidden text-ellipsis px-2 pb-2 text-sm">
        {cryptoUserSession.eoa}
      </div>
    ),
  },
  { type: 'separator' },
  {
    type: 'item',
    icon: <User />,
    // wrapper: <Link href="/profile" />,
    className: 'cursor-pointer',
    text: 'Profile',
    shortcut: '⇧⌘P',
  },
  {
    type: 'item',
    icon: <Settings />,
    // wrapper: <Link href="/settings" />,
    className: 'cursor-pointer',
    text: 'Settings',
    shortcut: '⌘S',
  },
  { type: 'separator' },
  {
    type: 'item',
    icon: <LifeBuoy />,
    className: 'cursor-pointer',
    text: 'Support',
  },
  { type: 'separator' },
  {
    type: 'item',
    icon: <LogOut />,
    className: 'cursor-pointer',
    text: 'Log out',
    shortcut: '⇧⌘Q',
  },
] satisfies ProfileNavProps['items'];

export const normalUserMenuItems = [
  cryptoUserMenuItems[0],
  {
    type: 'children',
    children: (
      <div className="overflow-hidden text-ellipsis  px-2 pb-2 text-sm">
        {normalUserSession.name}
      </div>
    ),
  },
  ...cryptoUserMenuItems.slice(2),
] satisfies ProfileNavProps['items'];

export function ProfileNavExample(props: ProfileNavProps) {
  return (
    <div className="flex">
      <ProfileNav {...props} />{' '}
    </div>
  );
}

export const notConnectedMenuItems = [
  {
    type: 'item',
    icon: <LogIn />,
    className: 'cursor-pointer font-semibold',
    text: 'Sign In',
  },
  { type: 'separator' },
  {
    type: 'item',
    // wrapper: <Link href="/settings" />,
    icon: <Settings />,
    className: 'cursor-pointer',
    text: 'Settings',
  },
  { type: 'separator' },
  {
    type: 'item',
    icon: <LifeBuoy />,
    className: 'cursor-pointer',
    text: 'Support',
  },
] satisfies ProfileNavProps['items'];

export function ProfileNavClientExample({
  account,
  isNextAuthConnected = false,
}) {
  const t = useTranslations('AppNav.Profile');
  return (
    <div className="flex">
      <NextAuthProvider session={null}>
        <AuthProvider session={null} isConnected={() => true}>
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
              createAccountDescription: t(
                'sections-text.create-account-description',
              ),
              dontHaveAnAccount: t('sections-text.dont-have-an-account'),
              settings: t('sections-text.settings'),
              verifyEmail: t('sections-text.verify-email'),
              verifyEmailContinue: t('sections-text.verify-email-continue'),
            }}
            isNextAuthConnected={isNextAuthConnected}
            account={account}
          />{' '}
        </AuthProvider>
      </NextAuthProvider>
    </div>
  );
}
