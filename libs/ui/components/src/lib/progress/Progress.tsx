'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusBgColorVariants } from '../shared/statusVariant';

const progressSizes = {
  xs: 'h-0.5 md:h-1',
  sm: 'h-1 md:h-1.5',
  default: 'h-2 md:h-2.5',
  lg: 'h-3 md:h-3.5',
  xl: 'h-4 md:h-4.5',
};

const progressVariants = statusBgColorVariants;

export type ProgressRootProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> &
  VariantProps<typeof progressRootVariants>;

const progressRootVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-secondary',
  {
    variants: {
      size: progressSizes,
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export type ProgressIndicatorProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Indicator
> &
  VariantProps<typeof progressIndicatorVariants>;

const progressIndicatorVariants = cva('h-full w-full flex-1 bg-primary transition-all', {
  variants: {
    variant: progressVariants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ProgressProps extends ProgressRootProps, ProgressIndicatorProps {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, variant, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressRootVariants({ size, className }))}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressIndicatorVariants({ variant }))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress, progressSizes, progressVariants };
