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

export interface PassCardProps
  extends Omit<BoundedNumericStepperProps, 'initialValue'> {
  ticketType: string;
  description: string;
  price: number;
  numTickets: number;
}

export const PassCard: React.FC<PassCardProps> = ({
  ticketType,
  description,
  price,
  numTickets,
  ...boundedNumberProps
}) => (
  <Card className="flex flex-col justify-between">
    <CardHeader>
      <CardTitle>{ticketType}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter className="flex items-center justify-between">
      <Text>${price}</Text>
      <BoundedNumericStepper
        initialValue={numTickets}
        {...boundedNumberProps}
      />
    </CardFooter>
  </Card>
);

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
