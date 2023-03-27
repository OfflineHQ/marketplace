import * as React from 'react';
import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const variants = statusTextColorVariants;

const helperTextVariants = cva('text-sm opacity-80', {
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
  className?: string;
}

const HelperText: React.FC<HelperTextProps> = ({
  variant = 'default',
  children,
  id,
  className,
}) => {
  const helperTextClasses = cn(helperTextVariants({ variant, className }));
  return children ? (
    <p className={helperTextClasses} id={id}>
      {children}
    </p>
  ) : null;
};

export { HelperText, variants };
