import { NavigationMenu, NavigationMenuList } from '@ui/components';
import { CartNav, type CartNavProps } from './CartNav';

export const cartNavProps: CartNavProps = {
  helperText: 'Go to your cart',
  href: '/cart',
  text: 'Cart',
};

export function CartNavDemo(props: CartNavProps) {
  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <CartNav {...props} />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
