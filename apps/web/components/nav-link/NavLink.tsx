import { useRouter } from 'next/router';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
} from '@ui/components';
import NextLink, { LinkProps } from 'next/link';
import { cn } from '@ui/shared';

export type NavLinkProps<T = string> = {
  href: LinkProps<T>['href'];
  children: React.ReactNode | string;
  className?: string;
};

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const router = useRouter();
  const isActive = router.asPath === href;
  return (
    <NavigationMenuItem>
      <NextLink href={href} legacyBehavior passHref>
        <NavigationMenuLink
          className={cn(
            navigationMenuTriggerStyle(),
            className,
            //TODO change for existing primary color
            isActive ? 'underline' : ''
          )}
          {...props}
        >
          {children}
        </NavigationMenuLink>
      </NextLink>
    </NavigationMenuItem>
  );
}
