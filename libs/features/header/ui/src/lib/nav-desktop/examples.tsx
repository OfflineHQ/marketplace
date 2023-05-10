import { NavDesktopProps, NavDesktop } from './NavDesktop';

export const menuSections: NavDesktopProps['menuSections'] = [
  { children: 'Explore', href: '/' },
  { children: 'Collections', href: '/collections' },
  { children: 'FAQ', href: '/faq' },
];

export function NavDesktopExample(props: NavDesktopProps) {
  return <NavDesktop {...props} menuSections={menuSections} />;
}
