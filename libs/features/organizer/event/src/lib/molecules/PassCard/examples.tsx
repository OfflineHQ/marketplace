'use client';

import { EventPass, EventPassCart } from '@features/organizer/event-types';
import { type PassCardProps, PassCard } from './PassCard';
import { PassCardSelectProps } from './PassCardSelect';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { Currency_Enum } from '@gql/shared/types';

export const passWithMaxAmount: EventPass = {
  id: '1',
  name: 'General Admission',
  description: 'General Admission to the event',
  passOptions: [],
  eventPassPricing: {
    maxAmount: 7,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 130000,
  },
  eventPassOrderSums: {
    totalReserved: 1,
  },
};

export const passWithMaxAmountCart: EventPassCart = {
  id: passWithMaxAmount.id,
  amount: 6,
};

export const passWithMaxAmountPerUser: EventPass = {
  id: '2',
  name: 'VIP Pass',
  description: 'Access to all areas',
  passOptions: [],
  eventPassPricing: {
    maxAmountPerUser: 3,
    maxAmount: 30,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 250000,
  },
  eventPassOrderSums: {
    totalReserved: 10,
  },
};

export const passWithMaxAmountPerUserCart: EventPassCart = {
  id: passWithMaxAmountPerUser.id,
  amount: 3,
};

export const passWithSoldOut: EventPass = {
  id: '3',
  name: 'Student Pass',
  description: 'Discounted pass for students',
  passOptions: [],
  eventPassPricing: {
    maxAmount: 10,
    priceCurrency: Currency_Enum.Usd,
    priceAmount: 80000,
  },
  eventPassOrderSums: {
    totalReserved: 10,
  },
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
  passOptions: [],
  eventPassOrderSums: {
    totalReserved: 0,
  },
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
  passOptions: [],
  eventPassOrderSums: {
    totalReserved: 2,
  },
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
  passOptions: [],
  eventPassOrderSums: {
    totalReserved: 4,
  },
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
  passOptions: [],
  eventPassOrderSums: {
    totalReserved: 6,
  },
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
  passOptions: [],
  eventPassOrderSums: {
    totalReserved: 20,
  },
};

export const PassCardBoundaryMaxExample = ({
  organizerSlug,
  eventSlug,
  ...props
}: PassCardProps) => {
  const updatePassCart = usePassPurchaseStore((state) => state.updatePassCart);
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: { ...passWithMaxAmountCart, id: props.id },
  });
  return (
    <PassCard organizerSlug={organizerSlug} eventSlug={eventSlug} {...props} />
  );
};

export const PassCardBoundaryMaxPerUserExample = ({
  organizerSlug,
  eventSlug,
  ...props
}: PassCardProps) => {
  const updatePassCart = usePassPurchaseStore((state) => state.updatePassCart);
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: { ...passWithMaxAmountPerUserCart, id: props.id },
  });
  return (
    <PassCard organizerSlug={organizerSlug} eventSlug={eventSlug} {...props} />
  );
};
