// examples.tsx
import { PassSelection, PassSelectionProps } from './PassSelection';
import { useState } from 'react';
import { passTotalProps } from '../../molecules/PassTotal/examples';

export const passSelectionProps = {
  passes: passTotalProps['passes'],
  soldOutText: 'Sold out',
} satisfies PassSelectionProps;

export const PassSelectionExample = ({
  passes: _passes,
  soldOutText,
}: PassSelectionProps) => {
  const [passes, setPassesCart] = useState(_passes);

  const handleOnChange = (index: number, newNumTickets: number) => {
    setPassesCart((currentPasses) =>
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
      soldOutText={soldOutText}
    />
  );
};
