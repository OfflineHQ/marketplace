// examples.tsx
import { PassTotal, type PassTotalProps } from './PassTotal';
import { usePassPurchaseStore } from '@features/organizer/event/store';
import {
  passWithMaxAmount,
  passWithMaxAmountPerUser,
  passWithSoldOut,
  passFamily,
  passEarlyBird,
  passWeekend,
  passPremium,
  passWithMaxAmountCart,
  passWithMaxAmountPerUserCart,
} from '../PassCard/examples';

export const passTotalProps = {
  passesData: [passWithMaxAmount, passWithMaxAmountPerUser],
  organizerSlug: 'organizer-slug',
  eventSlug: 'event-slug',
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

export const PassTotalWith1PassExample = ({
  eventSlug,
  organizerSlug,
  ...props
}: PassTotalProps) => {
  const resetPasses = usePassPurchaseStore((state) => state.resetPasses);
  resetPasses();
  const updatePassCart = usePassPurchaseStore((state) => state.updatePassCart);
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: { ...passWithMaxAmountCart, amount: 1 },
  });
  return <PassTotal {...{ organizerSlug, eventSlug, ...props }} />;
};

export const PassTotalWithSeveralPassesExample = ({
  eventSlug,
  organizerSlug,
  ...props
}: PassTotalProps) => {
  const updatePassCart = usePassPurchaseStore((state) => state.updatePassCart);
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: passWithMaxAmountCart,
  });
  updatePassCart({
    organizerSlug,
    eventSlug,
    pass: passWithMaxAmountPerUserCart,
  });
  return <PassTotal {...{ organizerSlug, eventSlug, ...props }} />;
};
