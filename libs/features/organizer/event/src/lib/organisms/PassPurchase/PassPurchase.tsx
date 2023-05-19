// PassPurchase.tsx
import React, { useState } from 'react';
import { Cart } from '@ui/icons';
import {
  Card,
  CardContent,
  Text,
  TextSkeleton,
  CardFooter,
  CardHeader,
  CardTitle,
  CardTitleSkeleton,
  CardOverflow,
  CardOverlay,
  Button,
  AutoAnimate,
  Sheet,
  SheetTrigger,
  SheetContent,
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
} from '../PassSelection/PassSelection';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';

export interface PassPurchaseProps extends PassSelectionProps {
  goPaymentText: string;
  title: string;
  description: string;
}

export const PassPurchase: React.FC<PassPurchaseProps> = ({
  passes: _passes,
  goPaymentText,
  description,
  title,
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
    <Sheet open={true}>
      <SheetContent variant="stickyFooter" size="lg">
        <SheetHeader>
          <SheetTitle> {title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <SheetOverflow className="py-3">
          <PassSelection
            passes={passes.map((pass, index) => ({
              ...pass,
              onChange: (newNumTickets: number) =>
                handleOnChange(index, newNumTickets),
            }))}
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
    </Sheet>
  );
};

export const PassPurchaseSkeleton: React.FC = () => {
  return (
    <Sheet open={true}>
      <SheetContent variant="stickyFooter" size="lg">
        <SheetHeader>
          <SheetTitleSkeleton />
          <SheetDescriptionSkeleton />
        </SheetHeader>
        <SheetOverflow className="py-3">
          <PassSelectionSkeleton />
        </SheetOverflow>
      </SheetContent>
    </Sheet>
  );
};
