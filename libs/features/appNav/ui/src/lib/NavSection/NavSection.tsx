import { NavLink, type NavLinkProps } from '../nav-link/NavLink';
import {
  Button,
  ButtonSkeleton,
  Ping,
  type ButtonProps,
  PingProps,
} from '@ui/components';

export interface NavSectionProps
  extends Omit<NavLinkProps, 'children'>,
    Pick<ButtonProps, 'helperText' | 'isLoading'> {
  children?: React.ReactNode;
  ping?: PingProps;
}

export function NavSection({
  children,
  ping,
  helperText,
  isLoading,
  ...props
}: NavSectionProps) {
  return (
    <Ping {...ping} className="h-16 w-fit md:h-12">
      <Button
        variant="link"
        helperText={helperText}
        className="h-16 w-fit p-0 md:h-12"
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
    </Ping>
  );
}

export function NavSectionSkeleton() {
  return <ButtonSkeleton className="relative inline-block h-12 w-12 md:w-24" />;
}
