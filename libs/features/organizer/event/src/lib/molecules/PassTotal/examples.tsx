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
    id: '4',
    name: 'Family Pass',
    description: 'Pass for families with children',
    price: 2000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    id: '5',
    name: 'Early Bird Pass',
    description: 'Discounted pass for early birds',
    price: 1000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    id: '6',
    name: 'Weekend Pass',
    description: 'Pass for the entire weekend',
    price: 3000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
  {
    id: '7',
    name: 'Premium Pass',
    description: 'Premium access to all areas',
    price: 5000,
    numTickets: 0,
    maxAmount: 10,
    currentAmount: 0,
  },
] satisfies PassTotalProps['passes'];
