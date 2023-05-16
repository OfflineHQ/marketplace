// PassTotal.tsx
import React from 'react';
import { Text } from '@ui/components';
import { PassCardProps } from '../../molecules/PassCard/PassCard';

export interface PassTotalProps {
  passes: PassCardProps[];
}

export const PassTotal: React.FC<PassTotalProps> = ({ passes }) => {
  const totalPasses = passes.reduce((sum, pass) => sum + pass.numTickets, 0);
  const totalPrice = passes.reduce(
    (sum, pass) => sum + pass.numTickets * pass.price,
    0
  );

  return (
    <div className="flex-col">
      {/* TODO update with translation */}
      <Text variant="small">{totalPasses} passes selected</Text>
      <Text variant="h5">Total Price: ${totalPrice}</Text>
    </div>
  );
};
