import { EventPass } from '@features/back-office/events-types';
import { EventPassNftContractType_Enum } from '@gql/shared/types';

export const getEventPassType = (eventPass: EventPass) => {
  if (eventPass.eventPassNftContract?.type) {
    return eventPass.eventPassNftContract.type;
  }
  return eventPass.eventPassDelayedRevealed
    ? EventPassNftContractType_Enum.DelayedReveal
    : EventPassNftContractType_Enum.Normal;
};
