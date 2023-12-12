import { NavLink, NavLinkProps } from './NavLink';
import { NavigationMenu, NavigationMenuList } from '@ui/components';

export function NavLinkExample({ href, children }: NavLinkProps) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavLink href={href}>{children}</NavLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
