import env from '@env/server';
import { adminSdk } from '@gql/admin/api';
import {
  EventPassNftContractType_Enum,
  type Locale,
  type Stage,
} from '@gql/shared/types';
import { cache } from 'react';

interface GetEventPassDelayedRevealedFromEventPassIdProps {
  eventPassId: string;
  locale: Locale;
}

export async function isDelayedRevealed(eventPassId: string) {
  const data =
    await adminSdk.GetEventPassNftContractDelayedRevealedFromEventPassId({
      eventPassId: eventPassId,
    });
  const eventPassNftContract = data?.eventPassNftContract?.[0];
  return (
    eventPassNftContract?.type ===
      EventPassNftContractType_Enum.DelayedReveal &&
    eventPassNftContract?.isDelayedRevealed
  );
}

export const getEventPassDelayedRevealedFromEventPassId = cache(
  async ({
    eventPassId,
    locale,
  }: GetEventPassDelayedRevealedFromEventPassIdProps) => {
    if (!(await isDelayedRevealed(eventPassId))) {
      throw new Error('Event pass is not delayed revealed');
    }
    const data = await adminSdk.GetEventPassDelayedRevealedFromEventPassId({
      eventPassId: eventPassId,
      locale: locale,
      stage: env.HYGRAPH_STAGE as Stage,
    });
    return data?.eventPass?.eventPassDelayedRevealed;
  },
);
