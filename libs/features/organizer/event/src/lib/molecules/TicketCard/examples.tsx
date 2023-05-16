import { type TicketCardProps, TicketCard } from './TicketCard';
import { useState } from 'react';

export const ticketCardProps = {
  ticketType: 'General Admission',
  description: 'General Admission to the event',
  price: 1300,
  numTickets: 2,
  maxVal: 3,
} as TicketCardProps;

export const TicketCardExample = ({
  numTickets: _numTickets,
  onChange: _onChange,
  ...props
}: TicketCardProps) => {
  const [numTickets, setNumTickets] = useState(_numTickets);
  return (
    <TicketCard
      numTickets={numTickets}
      onChange={(val) => setNumTickets(val)}
      {...props}
    />
  );
};
