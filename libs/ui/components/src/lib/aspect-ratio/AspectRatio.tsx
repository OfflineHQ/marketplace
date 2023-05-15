'use client';
import * as React from 'react';
import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@ui/shared';

const aspectRatios = {
  square: 1,
  classic: 4 / 3,
  widescreen: 16 / 9,
  ultrawide: 21 / 9,
};

export interface AspectRatioProps {
  variant?: keyof typeof aspectRatios;
  children?: React.ReactNode;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ variant, children, ...props }, ref) => {
    const ratio = variant ? aspectRatios[variant] : 1;

    return (
      <AspectRatioPrimitive.Root ratio={ratio} ref={ref} {...props}>
        {children}
      </AspectRatioPrimitive.Root>
    );
  }
);

AspectRatio.displayName = 'AspectRatio';

const aspectRatioSkeletonSizes = {
  square: 'pt-square',
  classic: 'pt-classic',
  widescreen: 'pt-widescreen',
  ultrawide: 'pt-ultrawide',
};

const aspectRatioSkeletonVariantsCva = cva(
  'w-full animate-pulse rounded-sm bg-muted',
  {
    variants: {
      variant: aspectRatioSkeletonSizes,
    },
    defaultVariants: {
      variant: 'widescreen',
    },
  }
);

interface AspectRatioSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof aspectRatioSkeletonVariantsCva> {}

const AspectRatioSkeleton: React.FC<AspectRatioSkeletonProps> = ({
  variant = 'widescreen',
  className,
  ...props
}) => {
  const classNames = cn(aspectRatioSkeletonVariantsCva({ variant }), className);

  return (
    <div style={{ position: 'relative', width: '100%' }} {...props}>
      <div
        style={{
          paddingTop: `${(1 / aspectRatios[variant || 'widescreen']) * 100}%`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
        }}
        className={classNames}
      />
    </div>
  );
};

export {
  AspectRatio,
  aspectRatios,
  AspectRatioSkeleton,
  AspectRatioSkeletonProps,
};
