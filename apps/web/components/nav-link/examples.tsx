import { NavLink, NavLinkProps } from './NavLink';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@ui/components';

export function NavLinkExample({ href, children }: NavLinkProps<string>) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavLink href={href}>{children}</NavLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
