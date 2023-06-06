'use client';

// PassPurchase.tsx
import React, { useEffect } from 'react';
import { Cart } from '@ui/icons';
import {
  Button,
  AutoAnimate,
  type SheetNavigationProps,
  SheetOverlay,
  SheetOverflow,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTitleSkeleton,
  SheetDescription,
  SheetDescriptionSkeleton,
  SheetNavigationSkeleton,
  SheetNavigation,
} from '@ui/components';
import {
  PassSelection,
  PassSelectionProps,
  PassSelectionSkeleton,
} from '../../organisms/PassSelection/PassSelection';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';
import { usePassPurchaseStore } from '../../store/index';
import { useStore } from '@client/store';

export interface PassPurchaseProps
  extends PassSelectionProps,
    SheetNavigationProps {
  goPaymentText: string;
  title: string;
  description: string;
  soldOutText: string;
  eventSlug: string;
}

export const PassPurchase: React.FC<PassPurchaseProps> = ({
  passes: _passes,
  goPaymentText,
  description,
  title,
  size = 'lg',
  backButtonText,
  backButtonLink,
  soldOutText,
  eventSlug,
}) => {
  const store = useStore(usePassPurchaseStore, (state) => state);

  useEffect(() => {
    store?.setPasses(eventSlug, _passes);
  }, [store, eventSlug, _passes]);

  const handleOnChange = (
    pass: PassPurchaseProps['passes'][0],
    newNumTickets: number
  ) => {
    store?.updatePass(eventSlug, { ...pass, numTickets: newNumTickets });
  };

  const passes = store?.getPasses(eventSlug) ?? [];

  // Check if at least one pass has been selected
  const isPassSelected = passes.reduce(
    (acc, pass) => acc || pass.numTickets > 0,
    false
  );

  return (
    <>
      <SheetHeader size={size}>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassSelection
          passes={passes.map((pass, index) => ({
            ...pass,
            onChange: (newNumTickets: number) =>
              handleOnChange(pass, newNumTickets),
          }))}
          soldOutText={soldOutText}
        />
      </SheetOverflow>
      <AutoAnimate className="mt-auto">
        {isPassSelected && (
          <>
            <SheetOverlay footerHeight="112px" />
            <SheetFooter
              variant="sticky"
              className="flex flex-col items-start space-y-2"
            >
              <PassTotal passes={passes} />
              <Button className="w-full" block icon={Cart}>
                {goPaymentText}
              </Button>
            </SheetFooter>
          </>
        )}
      </AutoAnimate>
      <SheetNavigation
        size={size}
        backButtonText={backButtonText}
        backButtonLink={backButtonLink}
      />
    </>
  );
};

export type PassPurchaseSkeletonProps = Pick<SheetNavigationProps, 'size'>;

export const PassPurchaseSkeleton: React.FC<PassPurchaseSkeletonProps> = ({
  size = 'lg',
}) => {
  return (
    <>
      <SheetNavigationSkeleton size={size} />
      <SheetHeader size={size}>
        <SheetTitleSkeleton />
        <SheetDescriptionSkeleton />
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassSelectionSkeleton />
      </SheetOverflow>
    </>
  );
};
