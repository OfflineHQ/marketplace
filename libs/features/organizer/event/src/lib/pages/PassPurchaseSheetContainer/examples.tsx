import { passPurchaseProps } from '../PassPurchase/examples';
import { PassPurchase } from '../PassPurchase/PassPurchase';
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
      <PassPurchase {...passPurchaseProps} {...props} />
    </PassPurchaseSheetContainer>
  </AppNavLayout>
);

export const PassPurchaseSheetContainerWithFullSizeExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainerExample {...props} size="full" />
);
