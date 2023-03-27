'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusBgFillVariants } from '../shared/statusVariant';

const sizes = {
  xs: 'h-0.5 md:h-1',
  sm: 'h-1 md:h-1.5',
  md: 'h-2 md:h-2.5',
  lg: 'h-3 md:h-3.5',
  xl: 'h-4 md:h-4.5',
};

const variants = statusBgFillVariants;

export type ProgressRootProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Root
> &
  VariantProps<typeof progressRootVariants>;

const progressRootVariants = cva(
  'relative w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800',
  {
    variants: {
      size: sizes,
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export type ProgressIndicatorProps = React.ComponentPropsWithoutRef<
  typeof ProgressPrimitive.Indicator
> &
  VariantProps<typeof progressIndicatorVariants>;
const progressIndicatorVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: variants,
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

export { Progress, sizes, variants };
