import { passSelectionProps } from '../PassSelection/examples';
import { PassPurchase, type PassPurchaseProps } from './PassPurchase';
import { lotsOfPasses } from '../../molecules/PassTotal/examples';

export const passPurchaseProps = {
  ...passSelectionProps,
  goPaymentText: 'Go to Payment',
  title: 'Pass Selection',
};
export const passPurchasePropsWithLotsOfPasses = {
  ...passPurchaseProps,
  passes: lotsOfPasses,
} satisfies PassPurchaseProps;

export const PassPurchaseExample = (props: PassPurchaseProps) => (
  <PassPurchase {...props} />
);
