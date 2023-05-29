import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import { Button, type ButtonProps } from '@ui/components';

export interface NavSectionProps
  extends Omit<NavLinkProps, 'children'>,
    Pick<ButtonProps, 'ping' | 'helperText'> {
  children?: React.ReactNode;
}

export function NavSection({
  children,
  ping,
  helperText,
  ...props
}: NavSectionProps) {
  return (
    <Button
      variant="link"
      helperText={helperText}
      ping={ping}
      className="h-fit p-0 md:h-12"
    >
      <NavLink {...props} className="h-fit">
        <div className="flex flex-col items-center space-y-1 md:flex-row md:space-x-2">
          {children}
        </div>
      </NavLink>
    </Button>
  );
}
