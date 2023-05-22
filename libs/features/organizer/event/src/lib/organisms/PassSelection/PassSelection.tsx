import React from 'react';
import {
  PassCard,
  PassCardProps,
  PassCardSkeleton,
} from '../../molecules/PassCard/PassCard';

export interface PassSelectionProps {
  className?: string;
  soldOutText: string;
  passes: PassCardProps[];
}

export const PassSelection: React.FC<PassSelectionProps> = ({
  soldOutText,
  passes,
  className,
}) => (
  <div
    className={`grid grid-cols-1 gap-4 px-1 md:grid-cols-2 lg:grid-cols-3 ${className}`}
  >
    {passes.map((passProps, index) => (
      <PassCard key={index} {...passProps} soldOutText={soldOutText} />
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
