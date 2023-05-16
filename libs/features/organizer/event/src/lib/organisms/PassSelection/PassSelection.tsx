import React from 'react';
import { PassCard, PassCardProps } from '../../molecules/PassCard/PassCard';

export interface PassSelectionProps {
  passes: PassCardProps[];
}

export const PassSelection: React.FC<PassSelectionProps> = ({ passes }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {passes.map((passProps, index) => (
      <PassCard key={index} {...passProps} />
    ))}
  </div>
);
