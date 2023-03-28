'use client';
import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';

const aspectRatios = {
  square: 1,
  classic: 4 / 3,
  widescreen: 16 / 9,
  ultrawide: 21 / 9,
};

export interface AspectRatioProps {
  variant?: keyof typeof aspectRatios;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ variant, ...props }, ref) => {
    const ratio = variant ? aspectRatios[variant] : 1;
    return <AspectRatioPrimitive.Root ratio={ratio} ref={ref} {...props} />;
  }
);

AspectRatio.displayName = 'AspectRatio';

export { AspectRatio, aspectRatios };
