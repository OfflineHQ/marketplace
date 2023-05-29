import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import { Button, ButtonSkeleton, type ButtonProps } from '@ui/components';

export interface NavSectionProps
  extends Omit<NavLinkProps, 'children'>,
    Pick<ButtonProps, 'ping' | 'helperText' | 'isLoading'> {
  children?: React.ReactNode;
}

export function NavSection({
  children,
  ping,
  helperText,
  isLoading,
  ...props
}: NavSectionProps) {
  return (
    <Button
      variant="link"
      helperText={helperText}
      ping={ping}
      isLoading={isLoading}
      className="h-16 p-0 md:h-12"
    >
      <NavLink
        {...props}
        className={`h-fit pb-0 md:pb-2 ${
          isLoading ? 'pl-0 hover:bg-inherit focus:bg-inherit' : ''
        }`}
      >
        <div className="flex flex-col items-center space-y-1 md:flex-row md:space-x-2">
          {children}
        </div>
      </NavLink>
    </Button>
  );
}

export function NavSectionSkeleton() {
  return <ButtonSkeleton className="relative inline-block h-12 w-12 md:w-24" />;
}
