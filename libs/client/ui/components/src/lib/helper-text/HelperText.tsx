import * as React from 'react';
import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const variants = statusTextColorVariants;

const helperTextVariants = cva('text-sm', {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface HelperTextProps extends VariantProps<typeof helperTextVariants> {
  children?: React.ReactNode;
  id?: string;
}

const HelperText: React.FC<HelperTextProps> = ({ variant, children, id }) => {
  const helperTextClasses = cn(helperTextVariants({ variant }));
  return children ? (
    <p className={helperTextClasses} id={id}>
      {children}
    </p>
  ) : null;
};

export { HelperText, variants };
