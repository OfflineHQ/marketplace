import { ProfileNavProps, ProfileNav } from './ProfileNav';
import { ProfileNavClient } from './ProfileNavClient';
import {
  cryptoUserSession,
  normalUserSession,
} from '../profile-avatar/examples';
import { AuthProvider, NextAuthProvider } from '@next/auth';
import { useTranslations } from 'next-intl';
import { LifeBuoy, LogOut, LogIn, Settings, User } from '@ui/icons';

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
    text: 'Sign in',
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
