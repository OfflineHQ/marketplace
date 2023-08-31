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
  dateStart: '2021-01-01T21:00:00.000Z',
  dateEnd: '2021-01-03T12:00:00.000Z',
  eventPassNftContracts: [
    {
      eventPass: passFamily,
      eventPassNfts: [
        {
          isRevealed: false,
          tokenId: '1198',
        },
      ],
    },
    {
      eventPass: passWeekend,
      eventPassNfts: [
        {
          isRevealed: true,
          tokenId: '3',
        },
        {
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
  dateStart: '2021-02-18T12:00:00.000Z',
  dateEnd: '2021-01-19T12:00:00.000Z',
  eventPassNftContracts: [
    {
      eventPass: passPremium,
      eventPassNfts: [
        {
          isRevealed: false,
          tokenId: '1200',
        },
        {
          isRevealed: true,
          tokenId: '1201',
        },
      ],
    },
  ],
  event: event2Props,
  organizer: event2Props.organizer,
} satisfies UserPassEventProps['eventParameters'];
