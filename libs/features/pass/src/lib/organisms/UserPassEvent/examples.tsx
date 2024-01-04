import {
  event2Props,
  eventProps,
  passEarlyBird,
  passFamily,
  passPremium,
  passWeekend,
} from '@features/organizer/event/examples';
import { EventPassNftContractType_Enum } from '@gql/shared/types';
import { type UserPassEventProps } from './UserPassEvent';

export const eventPassNftContract1 = {
  type: EventPassNftContractType_Enum.Normal,
  isDelayedRevealed: false,
  eventPass: passFamily,
  eventPassNfts: [
    {
      id: 'afasfkjasnfjkasf',
      isRevealed: false,
      tokenId: '1198',
    },
  ],
};

export const eventPassNftContract2 = {
  type: EventPassNftContractType_Enum.Normal,
  isDelayedRevealed: false,
  eventPass: passWeekend,
  eventPassNfts: [
    {
      id: 'agdagsgwfagsg',
      isRevealed: true,
      tokenId: '3',
    },
    {
      id: 'gadfgawtwgwq',
      isRevealed: true,
      tokenId: '4',
    },
  ],
};

export const eventParameters = {
  dateStart: '2021-01-01T21:00:00.000',
  dateEnd: '2021-01-03T12:00:00.000',
  timezone: 'Europe/Paris',
  eventPassNftContracts: [eventPassNftContract1, eventPassNftContract2],
  event: eventProps,
  organizer: eventProps.organizer,
} satisfies UserPassEventProps['eventParameters'];

export const eventPassNftContract3 = {
  type: EventPassNftContractType_Enum.Normal,
  isDelayedRevealed: false,
  eventPass: passPremium,
  eventPassNfts: [
    {
      id: 'hshsasagegsagedgsd',
      isRevealed: false,
      tokenId: '1200',
    },
    {
      id: 'y7asgdyu3q2jnfwaf',
      isRevealed: true,
      tokenId: '1201',
    },
  ],
};

export const eventPassNftContractDelayedReveal1 = {
  type: EventPassNftContractType_Enum.DelayedReveal,
  isDelayedRevealed: false,
  eventPass: passEarlyBird,
  eventPassNfts: [
    {
      id: 'afewgewg3qfasfgasg',
      isRevealed: false,
      tokenId: '1200',
    },
  ],
};

export const eventPassNftContractDelayedReveal2 = {
  type: EventPassNftContractType_Enum.DelayedReveal,
  isDelayedRevealed: true,
  eventPass: passEarlyBird,
  eventPassNfts: [
    {
      id: 'afewgewg3qfasfgasg',
      isRevealed: false,
      tokenId: '1200',
    },
    {
      id: 'gsunwfrsaflijssf',
      isRevealed: true,
      tokenId: '1201',
    },
  ],
};

export const eventParameters2 = {
  dateStart: '2021-02-18T12:00:00.000',
  dateEnd: '2021-01-19T12:00:00.000',
  timezone: 'Europe/London',
  eventPassNftContracts: [eventPassNftContract3],
  event: event2Props,
  organizer: event2Props.organizer,
} satisfies UserPassEventProps['eventParameters'];

export const eventParametersDelayedReveal = {
  dateStart: '2021-02-18T12:00:00.000',
  dateEnd: '2021-01-19T12:00:00.000',
  timezone: 'Europe/London',
  eventPassNftContracts: [eventPassNftContractDelayedReveal1],
  event: event2Props,
  organizer: event2Props.organizer,
} satisfies UserPassEventProps['eventParameters'];

export const eventParametersDelayedRevealRevealed = {
  dateStart: '2021-02-18T12:00:00.000',
  dateEnd: '2021-01-19T12:00:00.000',
  timezone: 'Europe/London',
  eventPassNftContracts: [eventPassNftContractDelayedReveal2],
  event: event2Props,
  organizer: event2Props.organizer,
} satisfies UserPassEventProps['eventParameters'];
