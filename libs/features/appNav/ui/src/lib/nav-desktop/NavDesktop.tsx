import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@ui/components';

/* eslint-disable-next-line */

export interface NavDesktopProps {
  menuSections: NavLinkProps[];
}

export function NavDesktop({ menuSections }: NavDesktopProps) {
  const sections = menuSections.map(({ children, href, ...rest }) => (
    <NavLink {...rest} key={`${href}-desktop`} href={href}>
      {children}
    </NavLink>
  ));
  return (
    <NavigationMenu>
      <NavigationMenuList>{sections}</NavigationMenuList>
    </NavigationMenu>
  );
}

export default NavDesktop;
