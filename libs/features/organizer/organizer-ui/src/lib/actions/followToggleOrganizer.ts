'use server';

import { adminSdk } from '@gql/admin/api';
import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

export const followToggleOrganizer = async (organizerSlug: string) => {
  if (!organizerSlug) {
    throw new Error('Organizer slug is empty');
  }
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }
  const resIsFollowing = await adminSdk.CheckFollowingOrganizer({
    accountId: user.id,
    organizerSlug: organizerSlug,
  });
  const isFollowing = resIsFollowing?.follow_by_pk ? true : false;
  if (isFollowing) {
    await adminSdk.DeleteFollowOrganizer({
      accountId: user.id,
      organizerSlug: organizerSlug,
    });
    return false;
  } else {
    await userSdk.InsertFollowOrganizer({
      organizerSlug: organizerSlug,
    });
    return true;
  }
};
