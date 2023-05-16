// examples.tsx
import { type PassTotalProps } from './PassTotal';

export const passTotalProps = {
  passes: [
    {
      ticketType: 'General Admission',
      description: 'General Admission to the event',
      price: 1300,
      numTickets: 2,
      maxVal: 3,
    },
    {
      ticketType: 'VIP Pass',
      description: 'Access to all areas',
      price: 2500,
      numTickets: 1,
      maxVal: 3,
    },
  ],
} as PassTotalProps;
