import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu';

import { DropdownMenuItems, type DropdownMenuItemsProps } from './DropdownMenuItems';

import { Button } from '../button/Button';

import {
  CreditCard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  OutlinePlusCircle,
  Settings,
  User,
  UserAdd,
  Users,
} from '@ui/icons';

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User size="sm" marginRight="md" />
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard size="sm" marginRight="md" />
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings size="sm" marginRight="md" />
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled>
            <Users size="sm" marginRight="md" />
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <UserAdd size="sm" marginRight="md" />
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  <Mail size="sm" marginRight="md" />
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <MessageSquare size="sm" marginRight="md" />
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <OutlinePlusCircle size="sm" marginRight="md" />
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Plus size="sm" marginRight="md" />
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LifeBuoy size="sm" marginRight="md" />
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut size="sm" marginRight="md" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export const menuItems = [
  { type: 'label', text: 'My Account' },
  { type: 'separator' },
  { type: 'item', icon: <User />, text: 'Profile', shortcut: '⇧⌘P' },
  { type: 'item', icon: <CreditCard />, text: 'Billing', shortcut: '⌘B' },
  { type: 'item', icon: <Settings />, text: 'Settings', shortcut: '⌘S' },
  { type: 'separator' },
  { type: 'item', icon: <Users />, text: 'Team', disabled: true },
  { type: 'item', icon: <UserAdd />, text: 'Invite users' },
  { type: 'item', icon: <Plus />, text: 'New Team', shortcut: '⌘+T' },
  { type: 'separator' },
  { type: 'item', icon: <LifeBuoy />, text: 'Support' },
  { type: 'separator' },
  { type: 'item', icon: <LogOut />, text: 'Log out', shortcut: '⇧⌘Q' },
] satisfies DropdownMenuItemsProps['items'];

export function DropdownMenuItemsDemo(props: DropdownMenuItemsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuItems {...props} />
    </DropdownMenu>
  );
}
