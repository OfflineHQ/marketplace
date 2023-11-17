'use client';

import { Link, usePathname } from '@next/navigation';
import {
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '@ui/components';
import { cn } from '@ui/shared';
import type { LinkProps } from 'next/link';

export type NavLinkProps = LinkProps & {
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className }: NavLinkProps) {
  const isActive = usePathname() === href;
  return (
    <NavigationMenuItem className="flex">
      <Link href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            className,
            isActive ? 'underline' : '',
            'bg-transparent',
          )}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}
