import type { Session } from 'next-auth';

export interface ProfileNavProps {
  session: Session;
}

export function ProfileNav(props: ProfileNavProps) {
  const {
    session: {
      address,
      user: { firstName, lastName, email, image },
    },
  } = props;
  return (
    <div>
      <h1>Welcome to ProfileMenu!</h1>
    </div>
  );
}

export default ProfileNav;
