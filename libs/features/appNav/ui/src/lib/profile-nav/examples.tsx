import { ProfileNavProps, ProfileNav } from './ProfileNav';
import {
  cryptoUserSession,
  normalUserSession,
} from '../profile-avatar/examples';
import { LifeBuoy, LogOut, Settings, User } from '@ui/icons';
// import Link from 'next/link';

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
