import { UserPassEvent, type UserPassEventProps } from './UserPassEvent';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
  passWithSoldOut,
  passFamily,
  passWeekend,
  passPremium,
  eventProps,
  event2Props,
} from '@features/organizer/event/examples';

export const eventParameters = {
  dateStart: '2021-01-01T21:00:00.000',
  dateEnd: '2021-01-03T12:00:00.000',
  timezone: 'Europe/Paris',
  eventPassNftContracts: [
    {
      eventPass: passFamily,
      eventPassNfts: [
        {
          id: 'afasfkjasnfjkasf',
          isRevealed: false,
          tokenId: '1198',
        },
      ],
    },
    {
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
    },
  ],
  event: eventProps,
  organizer: eventProps.organizer,
} satisfies UserPassEventProps['eventParameters'];

export const eventParameters2 = {
  dateStart: '2021-02-18T12:00:00.000',
  dateEnd: '2021-01-19T12:00:00.000',
  timezone: 'Europe/London',
  eventPassNftContracts: [
    {
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
    },
  ],
  event: event2Props,
  organizer: event2Props.organizer,
} satisfies UserPassEventProps['eventParameters'];
