'use client';

// PassPurchase.tsx
import React, { useState } from 'react';
import { Cart } from '@ui/icons';
import {
  Button,
  AutoAnimate,
  SheetContent,
  type SheetContentProps,
  SheetOverlay,
  SheetOverflow,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTitleSkeleton,
  SheetDescription,
  SheetDescriptionSkeleton,
} from '@ui/components';
import {
  PassSelection,
  PassSelectionProps,
  PassSelectionSkeleton,
} from '../../organisms/PassSelection/PassSelection';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';

export interface PassPurchaseProps
  extends PassSelectionProps,
    SheetContentProps {
  goPaymentText: string;
  title: string;
  description: string;
  soldOutText: string;
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
}) => {
  const [passes, setPasses] = useState(_passes);

  const handleOnChange = (index: number, newNumTickets: number) => {
    setPasses((currentPasses) =>
      currentPasses.map((pass, i) =>
        i === index ? { ...pass, numTickets: newNumTickets } : pass
      )
    );
  };

  // Check if at least one pass has been selected
  const isPassSelected = passes.reduce(
    (acc, pass) => acc || pass.numTickets > 0,
    false
  );

  return (
    <SheetContent
      variant="stickyFooter"
      size={size}
      backButtonText={backButtonText}
      backButtonLink={backButtonLink}
    >
      <SheetHeader size={size}>
        <SheetTitle>{title}</SheetTitle>
        <SheetDescription>{description}</SheetDescription>
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassSelection
          passes={passes.map((pass, index) => ({
            ...pass,
            onChange: (newNumTickets: number) =>
              handleOnChange(index, newNumTickets),
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
              <Button className="w-full" icon={Cart}>
                {goPaymentText}
              </Button>
            </SheetFooter>
          </>
        )}
      </AutoAnimate>
    </SheetContent>
  );
};

export type PassPurchaseSkeletonProps = Pick<SheetContentProps, 'size'>;

export const PassPurchaseSkeleton: React.FC<PassPurchaseSkeletonProps> = ({
  size = 'lg',
}) => {
  return (
    <SheetContent variant="stickyFooter" size={size} loading>
      <SheetHeader size={size}>
        <SheetTitleSkeleton />
        <SheetDescriptionSkeleton />
      </SheetHeader>
      <SheetOverflow className="py-3">
        <PassSelectionSkeleton />
      </SheetOverflow>
    </SheetContent>
  );
};
