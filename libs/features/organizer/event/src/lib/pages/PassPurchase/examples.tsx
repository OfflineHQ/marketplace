import { passSelectionProps } from '../../organisms/PassSelection/examples';
import { PassPurchase, type PassPurchaseProps } from './PassPurchase';
import { lotsOfPasses } from '../../molecules/PassTotal/examples';

export const passPurchaseProps = {
  ...passSelectionProps,
  goPaymentText: 'Go to payment',
  title: 'Pass selection',
  description: 'Select the passes you want to purchase and validate your order',
  backButtonText: 'Go back to the event',
  open: true,
  onOpenChange: () => null,
} satisfies PassPurchaseProps;
export const passPurchasePropsWithLotsOfPasses = {
  ...passPurchaseProps,
  passes: lotsOfPasses,
} satisfies PassPurchaseProps;

export const PassPurchaseExample = (props: PassPurchaseProps) => (
  <PassPurchase {...props} />
);
