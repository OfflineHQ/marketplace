import { passPurchaseProps } from '../PassPurchase/examples';
import { PassPurchaseSheet } from '../PassPurchase/PassPurchaseSheet';
import {
  PassPurchaseSheetContainer,
  type PassPurchaseSheetContainerProps,
} from './PassPurchaseSheetContainer';
import { WithNormalUser } from '@features/appNav/ui/stories';
import { AppNavLayout } from '@features/appNav/ui';

export const passPurchaseContainerProps = {
  open: true,
  onOpenChange: () => null,
} satisfies PassPurchaseSheetContainerProps;

export const PassPurchaseSheetContainerExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <AppNavLayout {...WithNormalUser.args}>
    <PassPurchaseSheetContainer {...props}>
      <PassPurchaseSheet {...passPurchaseProps} {...props} />
    </PassPurchaseSheetContainer>
  </AppNavLayout>
);

export const PassPurchaseSheetContainerWithFullSizeExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainerExample {...props} size="full" />
);
