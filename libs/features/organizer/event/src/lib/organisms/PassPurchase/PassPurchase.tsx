// PassPurchase.tsx
import React, { useState } from 'react';
import { Cart } from '@ui/icons';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
  AutoAnimate,
} from '@ui/components';
import {
  PassSelection,
  PassSelectionProps,
} from '../PassSelection/PassSelection';
import { PassTotal } from '../../molecules/PassTotal/PassTotal';

export type PassPurchaseProps = PassSelectionProps;

export const PassPurchase: React.FC<PassPurchaseProps> = ({
  passes: _passes,
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pass Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <PassSelection
          passes={passes.map((pass, index) => ({
            ...pass,
            onChange: (newNumTickets: number) =>
              handleOnChange(index, newNumTickets),
          }))}
        />
      </CardContent>
      <AutoAnimate>
        {isPassSelected && (
          <CardFooter className="flex flex-col items-start space-y-2">
            <PassTotal passes={passes} />
            <Button className="w-full" icon={Cart}>
              Go to payment
            </Button>
          </CardFooter>
        )}
      </AutoAnimate>
    </Card>
  );
};
