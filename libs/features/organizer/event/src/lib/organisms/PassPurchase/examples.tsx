import { passSelectionProps } from '../PassSelection/examples';
import { PassPurchase, type PassPurchaseProps } from './PassPurchase';

export const passPurchaseProps = passSelectionProps;

export const PassPurchaseExample = (props: PassPurchaseProps) => (
  <PassPurchase {...props} />
);
