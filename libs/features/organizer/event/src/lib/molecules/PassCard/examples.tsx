import { type PassCardProps, PassCard } from './PassCard';
import { useState } from 'react';

export const passCardProps = {
  ticketType: 'General Admission',
  description: 'General Admission to the event',
  price: 1300,
  numTickets: 2,
  maxVal: 3,
} as PassCardProps;

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
      {...props}
    />
  );
};
