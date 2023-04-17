import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItems,
  DropdownMenuItemsProps,
  NavigationMenu,
  Button,
  ButtonProps,
  NavigationMenuList,
} from '@ui/components';
import { Language } from '@ui/icons';

export interface LanguageDropdownProps extends DropdownMenuItemsProps, ButtonProps {}

export function LanguageDropdown({ items, ...props }: LanguageDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" icon={Language} {...props} />
      </DropdownMenuTrigger>
      <NavigationMenu>
        <NavigationMenuList>
          <DropdownMenuItems items={items} className="w-10" />
        </NavigationMenuList>
      </NavigationMenu>
    </DropdownMenu>
  );
}

export default LanguageDropdown;
