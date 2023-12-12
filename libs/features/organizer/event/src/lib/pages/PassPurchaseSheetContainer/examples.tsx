import { AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { Sheet } from '@ui/components';
import { Event } from '../Event/Event';
import { eventProps } from '../Event/examples';
import { PassPurchaseSheet } from '../PassPurchase/PassPurchaseSheet';
import { passPurchasePropsWithLotsOfPasses } from '../PassPurchase/examples';
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
      <Event {...eventProps} />
      <PassPurchaseSheetContainer {...props}>
        <PassPurchaseSheet {...passPurchasePropsWithLotsOfPasses} {...props} />
      </PassPurchaseSheetContainer>
    </Sheet>
  </AppNavLayout>
);

export const PassPurchaseSheetContainerWithFullSizeExample = ({
  ...props
}: PassPurchaseSheetContainerProps) => (
  <PassPurchaseSheetContainerExample {...props} size="full" />
);
