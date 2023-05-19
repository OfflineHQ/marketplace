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
  <Card>
    <CardHeader>
      <CardTitle>{ticketType}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <Text>${price}</Text>
        <BoundedNumericStepper
          initialValue={numTickets}
          {...boundedNumberProps}
        />
      </div>
    </CardContent>
  </Card>
);

export const PassCardSkeleton: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>
        <CardTitleSkeleton />
      </CardTitle>
      <CardDescription>
        <CardDescriptionSkeleton />
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between">
        <TextSkeleton />
        <ButtonSkeleton />
      </div>
    </CardContent>
  </Card>
);
