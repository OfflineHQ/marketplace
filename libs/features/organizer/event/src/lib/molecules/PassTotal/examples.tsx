// examples.tsx
import {
  passEarlyBird,
  passFamily,
  passPremium,
  passWeekend,
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
} from '../PassCard/examples';
import { PassTotal, type PassTotalProps } from './PassTotal';

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

export const PassTotalWith1PassExample = ({ ...props }: PassTotalProps) => {
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: { ...passWithMaxAmountCart, amount: 1 },
  // });
  return <PassTotal {...props} />;
};

export const PassTotalWithSeveralPassesExample = ({
  ...props
}: PassTotalProps) => {
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: passWithMaxAmountCart,
  // });
  // updatePassCart({
  //   organizerSlug,
  //   eventSlug,
  //   pass: passWithMaxAmountPerUserCart,
  // });
  return <PassTotal {...props} />;
};
