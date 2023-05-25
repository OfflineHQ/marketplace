import { passPurchaseProps } from '../PassPurchase/examples';
import { PassPurchase } from '../PassPurchase/PassPurchase';
import {
  PassPurchaseSheetContainer,
  type PassPurchaseSheetContainerProps,
} from './PassPurchaseSheetContainer';

export const passPurchaseContainerProps = {
  open: true,
  onOpenChange: () => null,
} satisfies PassPurchaseSheetContainerProps;

export const PassPurchaseSheetContainerExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainer {...props}>
    <PassPurchase {...passPurchaseProps} />
  </PassPurchaseSheetContainer>
);

export const PassPurchaseSheetContainerWithFullSizeExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainer {...props}>
    <PassPurchase {...passPurchaseProps} size={'full'} />
  </PassPurchaseSheetContainer>
);
