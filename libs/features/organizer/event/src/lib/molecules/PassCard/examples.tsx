import { type PassCardProps, PassCard } from './PassCard';
import { useState } from 'react';

export const passWithMaxAmount: PassCardProps = {
  name: 'General Admission',
  description: 'General Admission to the event',
  price: 1300,
  numTickets: 2,
  maxAmount: 7,
  currentAmount: 1,
  onChange: () => null,
};

export const passWithMaxAmountPerUser: PassCardProps = {
  name: 'VIP Pass',
  description: 'Access to all areas',
  price: 2500,
  numTickets: 1,
  maxAmountPerUser: 3,
  maxAmount: 30,
  currentAmount: 10,
  onChange: () => null,
};

export const passWithSoldOut: PassCardProps = {
  name: 'Student Pass',
  description: 'Discounted pass for students',
  price: 800,
  numTickets: 0,
  maxAmount: 10,
  currentAmount: 10,
  onChange: () => null,
};

export const PassCardExample = ({
  numTickets: _numTickets,
  onChange: _onChange,
  ...props
}: PassCardProps) => {
  const [numTickets, setNumTickets] = useState(_numTickets);
  return (
    <PassCard
      numTickets={numTickets}
      onChange={(val) => setNumTickets(val)}
      soldOutText="Sold out"
      {...props}
    />
  );
};
