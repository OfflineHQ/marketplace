// examples.tsx
import { type PassTotalProps } from './PassTotal';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
} from '../PassCard/examples';

export const passTotalProps = {
  passes: [passWithMaxAmount, passWithMaxAmountPerUser],
} satisfies PassTotalProps;

export const lotsOfPasses = [
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
  {
    name: 'Family Pass',
    description: 'Pass for families with children',
    price: 2000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    name: 'Early Bird Pass',
    description: 'Discounted pass for early birds',
    price: 1000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    name: 'Weekend Pass',
    description: 'Pass for the entire weekend',
    price: 3000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    name: 'Premium Pass',
    description: 'Premium access to all areas',
    price: 5000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
] satisfies PassTotalProps['passes'];
