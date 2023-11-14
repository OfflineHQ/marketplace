import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

import {
  CreditCard,
  LifeBuoy,
  LogOut,
  Plus,
  Settings,
  User,
  UserAdd,
  Users,
} from '@ui/icons';

import { SelectItems, SelectItemsProps } from './SelectItems';

export function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="carrot" disabled>
            Carrot
          </SelectItem>
          <SelectItem value="courgette">Courgette</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
          <SelectItem value="pork">Pork</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const menuItems = [
  { type: 'label', text: 'My Account', value: 'my-account' },
  { type: 'separator' },
  { type: 'item', icon: <User />, text: 'Profile' },
  { type: 'item', icon: <CreditCard />, text: 'Billing' },
  { type: 'item', icon: <Settings />, text: 'Settings' },
  { type: 'separator' },
  { type: 'item', icon: <Users />, text: 'Team', disabled: true },
  { type: 'item', icon: <UserAdd />, text: 'Invite users' },
  { type: 'item', icon: <Plus />, text: 'New Team' },
  { type: 'separator' },
  { type: 'item', icon: <LifeBuoy />, text: 'Support' },
  { type: 'separator' },
  { type: 'item', icon: <LogOut />, text: 'Log out' },
] satisfies SelectItemsProps['items'];

export function SelectItemsDemo(props: SelectItemsProps) {
  return (
    <div className="flex">
      <Select>
        <SelectTrigger className="flex h-full items-center space-x-2">
          <SelectValue placeholder="Select an item" />
        </SelectTrigger>
        <SelectItems {...props} />
      </Select>
    </div>
  );
}
