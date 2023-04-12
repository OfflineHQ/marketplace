import type { Session } from 'next-auth';
import { ProfileNavProps, ProfileNav } from './ProfileNav';

export function ProfileNavExample(props: ProfileNavProps) {
  return <ProfileNav {...props} />;
}
