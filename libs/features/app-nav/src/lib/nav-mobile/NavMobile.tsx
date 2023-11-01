import { NavigationMenu, NavigationMenuList } from '@ui/components';
import { NavLink, type NavLinkProps } from '../nav-link/NavLink';

export interface NavMobileProps {
  menuSections: NavLinkProps[];
  children?: React.ReactNode;
  className?: string;
}

export function NavMobile({
  menuSections,
  children,
  className,
}: NavMobileProps) {
  const sections = menuSections.map(({ children: section, href, ...rest }) => (
    <NavLink {...rest} href={href} key={`${href}-mobile`}>
      {section}
    </NavLink>
  ));
  return (
    <div className={className}>
      <NavigationMenu
        orientation="vertical"
        className="z-10 flex-1 items-start justify-start"
      >
        <NavigationMenuList
          data-orientation="vertical"
          className="flex-col items-start"
        >
          {sections}
        </NavigationMenuList>
      </NavigationMenu>
      {children || null}
    </div>
  );
}

export default NavMobile;
