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
      onChange: () => null,
    },
    {
      ticketType: 'VIP Pass',
      description: 'Access to all areas',
      price: 2500,
      numTickets: 1,
      maxVal: 3,
      onChange: () => null,
    },
  ],
} satisfies PassTotalProps;

export const lotsOfPasses = [
  {
    ticketType: 'General Admission',
    description: 'General Admission to the event',
    price: 1300,
    numTickets: 2,
    maxVal: 3,
    onChange: () => null,
  },
  {
    ticketType: 'VIP Pass',
    description: 'Access to all areas',
    price: 2500,
    numTickets: 1,
    maxVal: 3,
    onChange: () => null,
  },
  {
    ticketType: 'Student Pass',
    description: 'Discounted pass for students',
    price: 800,
    numTickets: 1,
    maxVal: 5,
    onChange: () => null,
  },
  {
    ticketType: 'Family Pass',
    description: 'Pass for families with children',
    price: 2000,
    numTickets: 4,
    maxVal: 2,
    onChange: () => null,
  },
  {
    ticketType: 'Early Bird Pass',
    description: 'Discounted pass for early birds',
    price: 1000,
    numTickets: 1,
    maxVal: 10,
    onChange: () => null,
  },
  {
    ticketType: 'Weekend Pass',
    description: 'Pass for the entire weekend',
    price: 3000,
    numTickets: 1,
    maxVal: 2,
    onChange: () => null,
  },
  {
    ticketType: 'Premium Pass',
    description: 'Premium access to all areas',
    price: 5000,
    numTickets: 1,
    maxVal: 1,
    onChange: () => null,
  },
];
