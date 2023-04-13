import { useRouter } from 'next/router';
import {
  NavigationMenuLink,
  navigationMenuTriggerStyle,
  NavigationMenuItem,
} from '@ui/components';
import Link from 'next/link';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@ui/shared';

export interface NavLinkProps {
  href: string;
  children: React.ReactNode | string;
  className?: string;
}

export function NavLink({ href, children, className, ...props }: NavLinkProps) {
  const router = useRouter();
  const isActive = router.asPath === href;
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
          {...props}
        >
          {children}
        </NavigationMenuLink>
      </Link>
    </NavigationMenuItem>
  );
}

export default NavLink;
