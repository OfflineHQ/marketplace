import * as React from 'react';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const helperTextVariants = statusTextColorVariants;

const helperTextCva = cva('text-sm opacity-80', {
  variants: {
    variant: helperTextVariants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface HelperTextProps extends VariantProps<typeof helperTextCva> {
  children?: React.ReactNode;
  id?: string;
  className?: string;
}

const HelperText: React.FC<HelperTextProps> = ({
  variant = 'default',
  children,
  id,
  className,
}) => {
  const helperTextClasses = cn(helperTextCva({ variant, className }));
  return children ? (
    <p className={helperTextClasses} id={id}>
      {children}
    </p>
  ) : null;
};

export { HelperText, helperTextVariants };
