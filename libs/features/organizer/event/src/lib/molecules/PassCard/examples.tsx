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

export const passWithMaxAmount: EventPass = {
  id: '1',
  name: 'General Admission',
  description: 'General Admission to the event',
  passOptions: passOptionsFestival,
  nftImage: {
    url: 'https://picsum.photos/id/620/350/350',
  },
  passAmount: {
    maxAmount: 7,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 130000,
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
  passAmount: {
    maxAmount: 30,
    maxAmountPerUser: 3,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 250000,
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
  passAmount: {
    maxAmount: 10,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 80000,
  },
  // eventPassOrderSums: {
  //   totalReserved: 10,
  // },
};

export const passWithSkeleton: EventPass = {
  id: 'fake_pass_card_loading',
  name: 'Pass loading the totalReserved',
  description: 'Pass loading the totalReserved',
  passAmount: {
    maxAmount: 0,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 0,
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
  passAmount: {
    maxAmount: 10,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 200000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/702/350/350',
  },
  passOptions: [],
  // eventPassOrderSums: {
  //   totalReserved: 2,
  // },
};

export const passFamilyCart: EventPassCart = {
  eventPassId: passFamily.id,
  quantity: 2,
};

export const passEarlyBird: EventPass = {
  id: '5',
  name: 'Early Bird Pass',
  description: 'Discounted pass for early birds',
  passAmount: {
    maxAmount: 10,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 100000,
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
  passAmount: {
    maxAmount: 10,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 300000,
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
  passAmount: {
    maxAmount: 23,
    timeBeforeDelete: 14400,
  },
  passPricing: {
    currency: Currency_Enum.Usd,
    amount: 500000,
  },
  nftImage: {
    url: 'https://picsum.photos/id/627/350/350',
  },
  passOptions: passOptionsFootball,
  // eventPassOrderSums: {
  //   totalReserved: 20,
  // },
};
