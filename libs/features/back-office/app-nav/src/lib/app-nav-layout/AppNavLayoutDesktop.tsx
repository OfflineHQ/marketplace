import { NavLink } from '@features/app-nav';
import { NavigationMenu, NavigationMenuList, Separator } from '@ui/components';
import Logo from './Logo';

export interface AppNavLayoutDesktopProps {
  menuNav: React.ReactNode;
  profileNav: React.ReactNode;
}

export const AppNavLayoutDesktop: React.FC<AppNavLayoutDesktopProps> = ({
  profileNav,
  menuNav,
}) => {
  return (
    <div className="sticky top-0 z-20 hidden w-full border-b bg-background md:flex">
      <NavigationMenu className="flex-1 justify-start">
        <NavigationMenuList>
          <NavLink href="/" className="mx-4 my-2 min-w-[100px] p-0">
            <Logo />
          </NavLink>
        </NavigationMenuList>
        {menuNav}
      </NavigationMenu>
      <NavigationMenu className="flex max-w-fit justify-end">
        <NavigationMenuList>
          <Separator orientation="vertical" className="my-1 h-12" />
          {profileNav}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};
