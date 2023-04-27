import { usePathname } from 'next/navigation';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
} from '@ui/components';
import Link, { LinkProps } from 'next/link';
import { cn } from '@ui/shared';

export type NavLinkProps<T> = LinkProps<T> & {
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className }: NavLinkProps<typeof href>) {
  const isActive = usePathname() === href;
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            className,
            //TODO change for existing primary color
            isActive ? 'underline' : ''
          )}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
