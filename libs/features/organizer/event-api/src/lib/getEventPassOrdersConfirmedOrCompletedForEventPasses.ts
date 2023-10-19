import { userSdk } from '@gql/user/api';
import { getCurrentUser } from '@next/next-auth/user';

interface getExistingEventPassesProps {
  eventPassIds: string[];
}

export const getEventPassOrdersConfirmedOrCompletedForEventPasses = async ({
  eventPassIds,
}: getExistingEventPassesProps) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  const data =
    await userSdk.GetEventPassOrdersConfirmedOrCompletedForEventPassIds(
      {
        eventPassIds,
      },
      {
        next: {
          tags: ['GetEventPassOrdersConfirmedOrCompletedForEventPassIds'],
        },
      },
    );
  return data?.eventPassOrder;
};
