'use client';

import { EventPassCart } from '@features/cart-types';
import { EventPass } from '@features/organizer/event-types';
import { Currency_Enum } from '@gql/shared/types';
import {
  passOptionsFestival,
  passOptionsFootball,
  passOptionsFormula1,
  passOptionsHolidays,
} from '../PassOptions/examples';
import { PassCard, type PassCardProps } from './PassCard';

export const passWithMaxAmount: EventPass = {
  id: '1',
  name: 'General Admission',
  description: 'General Admission to the event',
  passOptions: passOptionsFestival,
  nftImage: {
    url: 'https://picsum.photos/id/620/350/350',
  },
  eventPassPricing: {
    maxAmount: 7,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 130000,
  },
  // eventPassOrderSums: {
  //   totalReserved: 1,
  // },
};

export const passWithMaxAmountCart: EventPassCart = {
  eventPassId: passWithMaxAmount.id,
  quantity: 6,
};

export const passWithMaxAmountPerUser: EventPass = {
  id: '2',
  name: 'VIP Pass',
  description: 'Access to all areas',
  nftImage: {
    url: 'https://picsum.photos/id/621/450/350',
  },
  passOptions: passOptionsHolidays,
  eventPassPricing: {
    maxAmountPerUser: 3,
    maxAmount: 30,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 250000,
  },
  // eventPassOrderSums: {
  //   totalReserved: 10,
  // },
};

export const passWithMaxAmountPerUserCart: EventPassCart = {
  eventPassId: passWithMaxAmountPerUser.id,
  quantity: 3,
};

export const passWithSoldOut: EventPass = {
  id: '3',
  name: 'Student Pass',
  description: 'Discounted pass for students',
  nftImage: {
    url: 'https://picsum.photos/id/622/350/350',
  },
  passOptions: passOptionsFormula1,
  eventPassPricing: {
    maxAmount: 10,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 80000,
  },
  // eventPassOrderSums: {
  //   totalReserved: 10,
  // },
};

export const passWithSkeleton: EventPass = {
  id: 'fake_pass_card_loading',
  name: 'Pass loading the totalReserved',
  description: 'Pass loading the totalReserved',
  eventPassPricing: {
    maxAmount: 0,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 0,
  },
  nftImage: {
    url: 'https://picsum.photos/id/623/350/350',
  },
  passOptions: [],
  // eventPassOrderSums: {
  //   totalReserved: 0,
  // },
};

export const passFamily: EventPass = {
  id: '4',
  name: 'Family Pass',
  description: 'Pass for families with children',
  eventPassPricing: {
    maxAmount: 10,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 200000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/702/350/350',
  },
  passOptions: [],
  // eventPassOrderSums: {
  //   totalReserved: 2,
  // },
};

export const passEarlyBird: EventPass = {
  id: '5',
  name: 'Early Bird Pass',
  description: 'Discounted pass for early birds',
  eventPassPricing: {
    maxAmount: 10,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 100000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/625/350/350',
  },
  passOptions: [],
  // eventPassOrderSums: {
  //   totalReserved: 4,
  // },
};

export const passWeekend: EventPass = {
  id: '6',
  name: 'Weekend Pass',
  description: 'Pass for the entire weekend',
  eventPassPricing: {
    maxAmount: 10,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 300000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/626/350/350',
  },
  passOptions: [],
  // eventPassOrderSums: {
  //   totalReserved: 6,
  // },
};

export const passPremium: EventPass = {
  id: '7',
  name: 'Premium Pass',
  description: 'Premium access to all areas',
  eventPassPricing: {
    maxAmount: 23,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 500000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/627/350/350',
  },
  passOptions: passOptionsFootball,
  // eventPassOrderSums: {
  //   totalReserved: 20,
  // },
};

export const PassCardBoundaryMaxExample = ({
  organizerSlug,
  eventSlug,
  ...props
}: PassCardProps) => {
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: { ...passWithMaxAmountCart, id: props.id },
  // });
  return (
    <PassCard organizerSlug={organizerSlug} eventSlug={eventSlug} {...props} />
  );
};

export const PassCardBoundaryMaxPerUserExample = ({
  organizerSlug,
  eventSlug,
  ...props
}: PassCardProps) => {
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: { ...passWithMaxAmountPerUserCart, id: props.id },
  // });
  return (
    <PassCard organizerSlug={organizerSlug} eventSlug={eventSlug} {...props} />
  );
};
