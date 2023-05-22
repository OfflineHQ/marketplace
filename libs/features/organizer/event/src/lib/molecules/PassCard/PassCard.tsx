import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardTitleSkeleton,
  CardDescriptionSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  BoundedNumericStepper,
  BoundedNumericStepperProps,
  Text,
} from '@ui/components';

import type { Pass } from '../../types';
export interface PassCardProps
  extends Omit<BoundedNumericStepperProps, 'initialValue' | 'maxVal'>,
    Pass {
  description: string;
  numTickets: number;
}

export const PassCard: React.FC<PassCardProps> = ({
  name,
  description,
  price,
  numTickets,
  maxAmount,
  maxAmountPerUser,
  currentAmount,
  ...boundedNumberProps
}) => {
  const maxAvailableTickets = maxAmount - currentAmount;
  const maxVal =
    maxAmountPerUser && maxAmountPerUser < maxAvailableTickets
      ? maxAmountPerUser
      : maxAvailableTickets;

  // TODO: add chip for when not enough tickets available and if less than 10% of tickets available (for instance 'only 5 tickets left')
  return (
    <Card className="flex flex-col justify-between">
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex items-center justify-between">
        <Text>${price}</Text>
        <div className="flex gap-1">
          <BoundedNumericStepper
            initialValue={numTickets}
            maxVal={maxVal}
            {...boundedNumberProps}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export const PassCardSkeleton: React.FC = () => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <CardTitleSkeleton />
      <CardDescriptionSkeleton />
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <TextSkeleton />
        <ButtonSkeleton />
      </div>
    </CardContent>
  </Card>
);
