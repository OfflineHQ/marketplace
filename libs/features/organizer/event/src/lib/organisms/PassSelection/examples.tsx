// examples.tsx
import { PassSelection, PassSelectionProps } from './PassSelection';
import { useState } from 'react';

export const passSelectionProps: PassSelectionProps = {
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
      description: 'VIP Access to the event',
      price: 2500,
      numTickets: 1,
      maxVal: 2,
      onChange: () => null,
    },
    // Add more passes as needed
  ],
};

export const PassSelectionExample = ({
  passes: _passes,
}: PassSelectionProps) => {
  const [passes, setPasses] = useState(_passes);

  const handleOnChange = (index: number, newNumTickets: number) => {
    setPasses((currentPasses) =>
      currentPasses.map((pass, i) =>
        i === index ? { ...pass, numTickets: newNumTickets } : pass
      )
    );
  };

  return (
    <PassSelection
      passes={passes.map((pass, index) => ({
        ...pass,
        onChange: (newNumTickets: number) =>
          handleOnChange(index, newNumTickets),
      }))}
    />
  );
};
