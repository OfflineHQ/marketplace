'use server';
import { adminSdk } from '@gql/admin/api';
import { getCurrentUser } from '@next/next-auth/user';
import { AppUser } from '@next/types';

export const isFollowingOrganizer = async (organizerSlug: string) => {
  let user: AppUser | undefined;
  try {
    user = await getCurrentUser();
    if (!user) {
      return false;
    }
  } catch (e) {
    return false;
  }
  const res = await adminSdk.CheckFollowingOrganizer({
    accountId: user.id,
    organizerSlug: organizerSlug,
  });
  return res?.follow_by_pk ? true : false;
};
