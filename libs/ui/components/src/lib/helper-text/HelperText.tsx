import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';
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
  message?: string | string[];
  id?: string;
  className?: string;
  htmlFor?: string;
  disabled?: boolean;
}

const HelperText: React.FC<HelperTextProps> = ({
  variant = 'default',
  children,
  message,
  id,
  className,
  disabled,
  ...props
}) => {
  const helperTextClasses = cn(helperTextCva({ variant, className }));

  const renderMessage = () => {
    if (Array.isArray(message)) {
      return message.map((msg, index) => <p key={index}>{msg}</p>);
    }
    return <p>{message}</p>;
  };
  return (
    <>
      <input className="peer hidden" disabled={disabled} aria-hidden="true" />
      {children || (Array.isArray(message) ? message.length > 0 : message) ? (
        <div className={helperTextClasses} id={id} {...props}>
          {children}
          {message && renderMessage()}
        </div>
      ) : null}
    </>
  );
};

export { HelperText, helperTextVariants };
