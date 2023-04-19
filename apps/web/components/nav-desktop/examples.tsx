import { NavDesktopProps, NavDesktop } from './NavDesktop';
import type { Route } from 'next';

export const menuSections: NavDesktopProps['menuSections'] = [
  { children: 'Explore', href: '/' },
  { children: 'Collections', href: '/collections' as Route },
  { children: 'FAQ', href: '/faq' as Route },
];

export function NavDesktopExample(props: NavDesktopProps) {
  return <NavDesktop {...props} menuSections={menuSections} />;
}
