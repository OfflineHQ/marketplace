import { NavigationMenu, NavigationMenuList } from '@ui/components';

export interface AppNavLayoutMobileProps {
  menuNav: React.ReactNode;
  profileNav: React.ReactNode;
}

export const AppNavLayoutMobile: React.FC<AppNavLayoutMobileProps> = ({
  profileNav,
  menuNav,
}) => {
  return (
    <NavigationMenu
      data-testid="mobile-menu"
      className="fixed bottom-0 z-20 flex w-full border-t bg-background md:hidden"
    >
      {menuNav}
      <NavigationMenuList className="flex w-full">
        <div className="w-28 flex-1 whitespace-nowrap text-center">
          {profileNav}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
