import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  BoundedNumericStepper,
  BoundedNumericStepperProps,
  Text,
} from '@ui/components';

export interface TicketCardProps
  extends Omit<BoundedNumericStepperProps, 'initialValue'> {
  ticketType: string;
  description: string;
  price: number;
  numTickets: number;
}

export const TicketCard: React.FC<TicketCardProps> = ({
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
