import type { Session } from 'next-auth';
/* eslint-disable-next-line */
export interface NavDesktopProps {
  session: Session | null | undefined;
}

export function NavDesktop(props: NavDesktopProps) {
  return (
    <div>
      <h1>Welcome to NavDesktop!</h1>
    </div>
  );
}

export default NavDesktop;
