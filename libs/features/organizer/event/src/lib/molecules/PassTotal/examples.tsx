// examples.tsx
import {
  passEarlyBird,
  passFamily,
  passPremium,
  passWeekend,
  passWithMaxAmount,
  passWithMaxAmountCart,
  passWithMaxAmountPerUser,
  passWithMaxAmountPerUserCart,
  passWithSoldOut,
} from '../PassCard/examples';
import { type PassTotalProps } from './PassTotal';

export const passTotalProps = {
  passesData: [passWithMaxAmount, passWithMaxAmountPerUser],
  passesCart: [],
} satisfies PassTotalProps;

export const lotsOfPasses = [
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
  passFamily,
  passEarlyBird,
  passWeekend,
  passPremium,
] satisfies PassTotalProps['passesData'];

export { passWithMaxAmountCart, passWithMaxAmountPerUserCart };
