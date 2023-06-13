import { passSelectionProps } from '../../organisms/PassSelection/examples';
import {
  PassPurchase,
  PassPurchaseSkeleton,
  type PassPurchaseProps,
  type PassPurchaseSkeletonProps,
} from './PassPurchase';
import { lotsOfPasses } from '../../molecules/PassTotal/examples';
import { eventProps } from '../Event/examples';
import { Sheet } from '@ui/components';

export const passPurchaseProps = {
  ...passSelectionProps,
  backButtonText: 'Go back to the event',
  goPaymentText: 'Go to payment',
  goPaymentLink: { href: '/dummy' },
  title: 'Pass selection',
  organizerSlug: eventProps.organizer.slug,
  eventSlug: eventProps.slug,
  description: 'Select the passes you want to purchase and validate your order',
} satisfies PassPurchaseProps;
export const passPurchasePropsWithLotsOfPasses = {
  ...passPurchaseProps,
  passes: lotsOfPasses,
} satisfies PassPurchaseProps;

export const PassPurchaseExample = (props: PassPurchaseProps) => {
  window.localStorage.clear();
  return (
    <Sheet open={true}>
      <PassPurchase {...props} />
    </Sheet>
  );
};

export const PassPurchaseLoadingExample = (
  props: PassPurchaseSkeletonProps
) => (
  <Sheet open={true}>
    <PassPurchaseSkeleton {...props} />
  </Sheet>
);
