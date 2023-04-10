import type { Session } from 'next-auth';
import type { NavDesktopProps } from '../nav-desktop/NavDesktop';

export interface HeaderNavProps extends NavDesktopProps {
  session: Session | null | undefined;
}

export function HeaderNav(props: HeaderNavProps) {
  return (
    <div>
      <h1>Welcome to HeaderNav!</h1>
    </div>
  );
}

export default HeaderNav;
