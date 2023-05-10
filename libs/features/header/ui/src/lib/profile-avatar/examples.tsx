import { ProfileAvatarProps, ProfileAvatar } from './ProfileAvatar';

export const cryptoUserSession = {
  eoa: '0x1234567890123456789012345678901234567890',
  safes: ['0xf67c7d90beEC26BDB96A233D1ec9FC272225c5aC'],
} satisfies ProfileAvatarProps['user'];

export const normalUserSession = {
  eoa: '0x1bBEdB07706728A19c9dB82d3c420670D8040591',
  safes: [],
  email: 'johndoe@example.com',
  name: 'John Doe',
  aggregateVerifier: 'tkey-google-lrc',
  verifier: 'torus',
  verifierId: 'johndoe@example.com',
  typeOfLogin: 'google',
  dappShare: '',
  idToken:
    'eyJhbGciOiJFUzI1NiIsIn35cCI6IkpXVCIsImtpZCI6IlRZT2dnXy012U9FYmxhWS1WVlJZcVZhREFncHRuZktWNDUzNU1aUEMwdzAifQ',
  oAuthIdToken: '',
  oAuthAccessToken: '',
} satisfies ProfileAvatarProps['user'];

export const normalUserSessionWithImage = {
  ...normalUserSession,
  profileImage: 'https://robohash.org/johndoe.png?size=96x96',
} satisfies ProfileAvatarProps['user'];

export function ProfileAvatarExample(props: ProfileAvatarProps) {
  return <ProfileAvatar {...props} />;
}
