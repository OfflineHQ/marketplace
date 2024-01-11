import { AppContainer, AppNavLayout } from '@features/app-nav';
import { WithNormalUser } from '@features/app-nav/stories';
import { Sheet } from '@ui/components';
import { lotsOfPasses } from '../../molecules/PassTotal/examples';
import { passListProps } from '../../organisms/PassList/examples';
import { eventProps } from '../Event/examples';
import {
  PassPurchaseCard,
  type PassPurchaseCardProps,
} from './PassPurchaseCard';
import {
  PassPurchaseSheet,
  PassPurchaseSheetSkeleton,
  type PassPurchaseSheetProps,
  type PassPurchaseSheetSkeletonProps,
} from './PassPurchaseSheet';

export const passPurchaseProps = {
  ...passListProps,
  backButtonText: 'Go back to the event',
  goPaymentText: 'Go to payment',
  goPaymentLink: { href: '/dummy' },
  closeLink: { href: '/dummy' },
  title: 'Pass selection',
  organizerSlug: eventProps?.organizer?.slug || '',
  eventSlug: eventProps.slug,
  description: 'Select the passes you want to purchase and validate your order',
  eventParameters: {
    isSaleOngoing: true,
    ...eventProps.eventParameters,
  },
} satisfies PassPurchaseSheetProps;
export const passPurchasePropsWithLotsOfPasses = {
  ...passPurchaseProps,
  passes: lotsOfPasses,
} satisfies PassPurchaseSheetProps;

export const PassPurchaseSheetExample = (props: PassPurchaseSheetProps) => {
  window.localStorage.clear();
  return (
    <Sheet open={true}>
      <PassPurchaseSheet {...props} />
    </Sheet>
  );
};

export const PassPurchaseCardExample = (props: PassPurchaseCardProps) => (
  <AppNavLayout {...WithNormalUser.args}>
    <AppContainer>
      <PassPurchaseCard {...props} />
    </AppContainer>
  </AppNavLayout>
);

export const PassPurchaseSheetLoadingExample = (
  props: PassPurchaseSheetSkeletonProps,
) => (
  <Sheet open={true}>
    <PassPurchaseSheetSkeleton {...props} />
  </Sheet>
);
