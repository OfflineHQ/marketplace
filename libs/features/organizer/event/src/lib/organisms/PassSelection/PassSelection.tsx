import React from 'react';
import {
  PassCard,
  PassCardProps,
  PassCardSkeleton,
} from '../../molecules/PassCard/PassCard';

export interface PassSelectionProps {
  passes: PassCardProps[];
}

export const PassSelection: React.FC<PassSelectionProps> = ({ passes }) => (
  <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
    {passes.map((passProps, index) => (
      <PassCard key={index} {...passProps} />
    ))}
  </div>
);

export const PassSelectionSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <PassCardSkeleton key={index} />
    ))}
  </div>
);
