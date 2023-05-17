// examples.tsx
import { PassSelection, PassSelectionProps } from './PassSelection';
import { useState } from 'react';
import { passTotalProps } from '../../molecules/PassTotal/examples';

export const passSelectionProps = {
  passes: passTotalProps['passes'],
} satisfies PassSelectionProps;

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
