import type { Session } from 'next-auth';
import { ProfileAvatarProps, ProfileAvatar } from './ProfileAvatar';

export const cryptoUserSession = {
  user: {
    id: '5f9b5b9b-8c5e-4b1c-9b1f-8c5e4b1c9b1f',
    address: '0x1234567890123456789012345678901234567890',
  },
  error: '',
  expires: '',
} satisfies Session;

export const normalUserSession = {
  ...cryptoUserSession,
  user: {
    id: '5f9b5b9b-8c5e-4b1c-9b1f-8c5e4b1c9b1f',
    address: '0x1234567890123456789012345678901234567890',
    firstName: 'John',
    lastName: 'Doe',
    email: 'jonhdoe@gmail.com',
  },
} satisfies Session;

export const normalUserSessionWithImage = {
  ...normalUserSession,
  user: {
    ...normalUserSession.user,
    image: 'https://github.com/sebpalluel.png',
  },
} satisfies Session;

export function ProfileAvatarExample(props: ProfileAvatarProps) {
  return <ProfileAvatar {...props} />;
}
