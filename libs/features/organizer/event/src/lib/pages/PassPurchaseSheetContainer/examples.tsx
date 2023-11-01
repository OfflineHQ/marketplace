import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { Sheet } from '@ui/components';
import { PassPurchaseSheet } from '../PassPurchase/PassPurchaseSheet';
import { passPurchaseProps } from '../PassPurchase/examples';
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
  <AppNavLayout {...WithNormalUser.args}>
    <Sheet open={true}>
      <PassPurchaseSheetContainer {...props}>
        <PassPurchaseSheet {...passPurchaseProps} {...props} />
      </PassPurchaseSheetContainer>
    </Sheet>
  </AppNavLayout>
);

export const PassPurchaseSheetContainerWithFullSizeExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainerExample {...props} size="full" />
);
