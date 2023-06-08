'use client';

// PassPurchase.tsx
import React, { useEffect } from 'react';
import { Cart } from '@ui/icons';
import Link, { type LinkProps } from 'next/link';
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
  goPaymentLink: LinkProps;
  title: string;
  description: string;
  soldOutText: string;
  organizerSlug: string;
  eventSlug: string;
}

export const PassPurchase: React.FC<PassPurchaseProps> = ({
  passes: _passes,
  goPaymentText,
  goPaymentLink,
  description,
  title,
  size = 'lg',
  backButtonText,
  backButtonLink,
  soldOutText,
  organizerSlug,
  eventSlug,
}) => {
  // useStore here to avoid hydration mismatch
  const store = useStore(usePassPurchaseStore, (state) => state);
  // directly set possible existing passes in the store at page load
  const setPasses = usePassPurchaseStore((state) => state.setPasses);
  useEffect(() => {
    if (eventSlug && organizerSlug)
      setPasses(organizerSlug, eventSlug, _passes);
    // here avoid adding store to the dependencies array to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizerSlug, eventSlug, _passes]);

  const handleOnChange = (
    pass: PassPurchaseProps['passes'][0],
    newNumTickets: number
  ) => {
    store?.updatePass(organizerSlug, eventSlug, {
      ...pass,
      numTickets: newNumTickets,
    });
  };

  const passes = store?.getPasses(organizerSlug, eventSlug) ?? [];

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
              <Link
                {...goPaymentLink}
                legacyBehavior
                passHref
                className="w-full justify-center"
              >
                <Button
                  className={`w-full ${
                    size === 'lg' ? 'md:w-1/3' : 'md:w-1/6'
                  }`}
                  block
                  icon={Cart}
                >
                  {goPaymentText}
                </Button>
              </Link>
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
