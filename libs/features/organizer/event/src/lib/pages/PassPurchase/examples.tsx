import { passListProps } from '../../organisms/PassList/examples';
import {
  PassPurchaseSheet,
  PassPurchaseSheetSkeleton,
  type PassPurchaseSheetProps,
  type PassPurchaseSheetSkeletonProps,
} from './PassPurchaseSheet';
import { PassPurchaseCard } from './PassPurchaseCard';
import { lotsOfPasses } from '../../molecules/PassTotal/examples';
import { eventProps } from '../Event/examples';
import { Sheet } from '@ui/components';

export const passPurchaseProps = {
  ...passListProps,
  backButtonText: 'Go back to the event',
  goPaymentText: 'Go to payment',
  goPaymentLink: { href: '/dummy' },
  title: 'Pass selection',
  organizerSlug: eventProps?.organizer?.slug || '',
  eventSlug: eventProps.slug,
  description: 'Select the passes you want to purchase and validate your order',
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

export const PassPurchaseCardExample = (props: PassPurchaseSheetProps) => (
  <PassPurchaseCard {...props} />
);

export const PassPurchaseSheetLoadingExample = (
  props: PassPurchaseSheetSkeletonProps
) => (
  <Sheet open={true}>
    <PassPurchaseSheetSkeleton {...props} />
  </Sheet>
);
