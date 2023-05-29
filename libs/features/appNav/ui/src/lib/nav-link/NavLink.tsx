import { usePathname } from 'next/navigation';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
} from '@ui/components';
import Link, { type LinkProps } from 'next/link';
import { cn } from '@ui/shared';

export type NavLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className }: NavLinkProps) {
  const isActive = usePathname() === href;
  return (
    <NavigationMenuItem>
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            className,
            //TODO change for existing primary color
            isActive ? 'underline' : 'no-underline'
          )}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
