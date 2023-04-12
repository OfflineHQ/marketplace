import { ProfileNavProps, ProfileNav } from './ProfileNav';
import { LifeBuoy, LogOut, Settings, User } from '@ui/icons';

export const menuItems = [
  { type: 'label', text: 'My Account' },
  { type: 'separator' },
  { type: 'item', icon: <User />, text: 'Profile', shortcut: '⇧⌘P' },
  { type: 'item', icon: <Settings />, text: 'Settings', shortcut: '⌘S' },
  { type: 'separator' },
  { type: 'item', icon: <LifeBuoy />, text: 'Support' },
  { type: 'separator' },
  { type: 'item', icon: <LogOut />, text: 'Log out', shortcut: '⇧⌘Q' },
] satisfies ProfileNavProps['items'];

export function ProfileNavExample(props: ProfileNavProps) {
  return <ProfileNav {...props} />;
}
