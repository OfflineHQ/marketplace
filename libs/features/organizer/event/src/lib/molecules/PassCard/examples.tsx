'use client';

import { EventPass, EventPassCart } from '../../types';
import { type PassCardProps, PassCard } from './PassCard';
import { PassCardSelectProps } from './PassCardSelect';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import { Currency } from '@gql/shared/types';

export const passWithMaxAmount: EventPass = {
  id: '1',
  name: 'General Admission',
  description: 'General Admission to the event',
  price: {
    currency: Currency.Usd,
    amount: 130000,
  },
  passOptions: [],
  maxAmount: 7,
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
  price: {
    currency: Currency.Usd,
    amount: 250000,
  },
  passOptions: [],
  maxAmountPerUser: 3,
  maxAmount: 30,
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
  price: {
    currency: Currency.Usd,
    amount: 80000,
  },
  passOptions: [],
  maxAmount: 10,
  eventPassOrderSums: {
    totalReserved: 10,
  },
};

export const passWithSkeleton: EventPass = {
  id: 'fake_pass_card_loading',
  name: 'Pass loading the totalReserved',
  description: 'Pass loading the totalReserved',
  price: {
    currency: Currency.Usd,
    amount: 0,
  },
  passOptions: [],
  maxAmount: 0,
  eventPassOrderSums: {
    totalReserved: 0,
  },
};

export const passFamily: EventPass = {
  id: '4',
  name: 'Family Pass',
  description: 'Pass for families with children',
  price: {
    currency: Currency.Usd,
    amount: 200000,
  },
  passOptions: [],
  maxAmount: 10,
  eventPassOrderSums: {
    totalReserved: 2,
  },
};

export const passEarlyBird: EventPass = {
  id: '5',
  name: 'Early Bird Pass',
  description: 'Discounted pass for early birds',
  price: {
    currency: Currency.Usd,
    amount: 100000,
  },
  passOptions: [],
  maxAmount: 10,
  eventPassOrderSums: {
    totalReserved: 4,
  },
};

export const passWeekend: EventPass = {
  id: '6',
  name: 'Weekend Pass',
  description: 'Pass for the entire weekend',
  price: {
    currency: Currency.Usd,
    amount: 300000,
  },
  passOptions: [],
  maxAmount: 10,
  eventPassOrderSums: {
    totalReserved: 6,
  },
};

export const passPremium: EventPass = {
  id: '7',
  name: 'Premium Pass',
  description: 'Premium access to all areas',
  price: {
    currency: Currency.Usd,
    amount: 500000,
  },
  passOptions: [],
  maxAmount: 23,
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
