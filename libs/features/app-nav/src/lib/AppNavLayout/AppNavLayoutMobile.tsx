import { NavigationMenu, NavigationMenuList } from '@ui/components';

export interface AppNavLayoutMobileProps {
  cartNav: React.ReactNode;
  passNav: React.ReactNode;
  profileNav: React.ReactNode;
}

export const AppNavLayoutMobile: React.FC<AppNavLayoutMobileProps> = ({
  cartNav,
  passNav,
  profileNav,
}) => {
  return (
    <NavigationMenu
      data-testid="mobile-menu"
      className="fixed bottom-0 z-20 flex w-full bg-background md:hidden"
    >
      <NavigationMenuList className="flex w-full">
        <div className="w-28 flex-1 whitespace-nowrap text-center md:hidden">
          {cartNav}
        </div>
        <div className="w-28 flex-1 whitespace-nowrap text-center md:hidden">
          {passNav}
        </div>
        <div className="w-28 flex-1 whitespace-nowrap text-center md:hidden">
          {profileNav}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
