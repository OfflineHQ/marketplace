import { NavMobileProps, NavMobile } from './NavMobile';
import { menuSections } from '../nav-desktop/examples';

export { menuSections };
export function NavMobileExample(props: NavMobileProps) {
  return <NavMobile {...props} menuSections={menuSections} />;
}
