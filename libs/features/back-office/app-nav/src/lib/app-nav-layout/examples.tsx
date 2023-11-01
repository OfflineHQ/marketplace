import { ProfileNav, ProfileNavSkeleton } from '@features/app-nav';

export const ProfileNavWithNoUser = () => (
  <ProfileNav user={undefined} items={[]} signInText="Sign in" />
);

export const ProfileNavLoading = () => <ProfileNavSkeleton />;

export const ProfileNavWithNoUserLoading = () => (
  <ProfileNav
    user={undefined}
    items={[]}
    isLoading={true}
    signInText="Sign in"
  />
);
