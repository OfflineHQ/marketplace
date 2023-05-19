// PassPurchase.tsx
import React, { useState } from 'react';
import { Cart } from '@ui/icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardOverflow,
  CardOverlay,
  Button,
  AutoAnimate,
} from '@ui/components';
import {
  PassSelection,
  PassSelectionProps,
} from '../PassSelection/PassSelection';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';

export interface PassPurchaseProps extends PassSelectionProps {
  goPaymentText: string;
  title: string;
}

export const PassPurchase: React.FC<PassPurchaseProps> = ({
  passes: _passes,
  goPaymentText,
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
    <Card variant="stickyFooter">
      <CardOverflow>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <PassSelection
          passes={passes.map((pass, index) => ({
            ...pass,
            onChange: (newNumTickets: number) =>
              handleOnChange(index, newNumTickets),
          }))}
        />
      </CardOverflow>
      <AutoAnimate className="mt-auto">
        {isPassSelected && (
          <>
            <CardOverlay footerHeight="112px" />
            <CardFooter
              variant="sticky"
              className="flex flex-col items-start space-y-2"
            >
              <PassTotal passes={passes} />
              <Button className="w-full" icon={Cart}>
                {goPaymentText}
              </Button>
            </CardFooter>
          </>
        )}
      </AutoAnimate>
    </Card>
  );
};
