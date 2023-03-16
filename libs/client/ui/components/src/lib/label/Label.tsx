// Label.tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const variants = statusTextColorVariants;

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: variants,
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface LabelProps
  extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>,
    VariantProps<typeof labelVariants> {}

const Label = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>(
  ({ className, variant, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants({ variant }), className)}
      {...props}
    />
  )
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label, variants };
