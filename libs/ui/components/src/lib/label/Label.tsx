// Label.tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const labelVariants = statusTextColorVariants;

const labelCva = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: labelVariants,
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelCva> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, children, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelCva({ variant }), className)}
      {...props}
    >
      {children}
    </LabelPrimitive.Root>
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, labelVariants };
