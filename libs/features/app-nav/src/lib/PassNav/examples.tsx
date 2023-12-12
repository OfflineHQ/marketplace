import { NavigationMenu, NavigationMenuList } from '@ui/components';
import { PassNav, type PassNavProps } from './PassNav';

export const passNavProps: PassNavProps = {
  helperText: 'Go to your pass',
  href: '/pass',
  text: 'Pass',
};

export function PassNavDemo(props: PassNavProps) {
  return (
    <div className="flex">
      <NavigationMenu>
        <NavigationMenuList>
          <PassNav {...props} />
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
