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
      className="fixed bottom-0 z-20 flex w-full bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:hidden"
    >
      <NavigationMenuList className="flex h-16 w-full">
        <div className="w-28 flex-1 whitespace-nowrap text-center">
          {cartNav}
        </div>
        <div className="w-28 flex-1 whitespace-nowrap text-center">
          {passNav}
        </div>
        <div className="w-28 flex-1 whitespace-nowrap text-center">
          {profileNav}
        </div>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
