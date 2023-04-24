import * as React from 'react';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

const helperTextVariants = statusTextColorVariants;

const helperTextCva = cva('text-sm opacity-80 peer-disabled:opacity-50', {
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
  htmlFor?: string;
  disabled?: boolean;
}

const HelperText: React.FC<HelperTextProps> = ({
  variant = 'default',
  children,
  id,
  className,
  disabled,
  ...props
}) => {
  const helperTextClasses = cn(helperTextCva({ variant, className }));
  return (
    <>
      <input className="peer hidden" disabled={disabled} aria-hidden="true" />
      {children ? (
        <p className={helperTextClasses} id={id} {...props}>
          {children}
        </p>
      ) : null}
    </>
  );
};

export { HelperText, helperTextVariants };
