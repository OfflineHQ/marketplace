import * as React from 'react';
import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import {
  statusVariantIcons,
  statusBorderVariants as inputBorderVariants,
} from '../shared/statusVariant';
import { IconProps } from '@client/ui/icons';

const inputSizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-sm',
  lg: 'py-4 px-5 text-sm',
};

const inputCVA = cva(
  'border block w-full rounded-md bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50 dark:focus:ring-offset-slate-900 dark:focus:ring-slate-400',
  {
    variants: {
      size: inputSizes,
      variant: inputBorderVariants,
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputCVA> {
  icon?: React.FC<IconProps>;
  rightIcon?: React.FC<IconProps>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, variant = 'default', icon: Icon, rightIcon: RightIcon, ...props },
    ref
  ) => {
    const DefaultRightIcon = statusVariantIcons[variant || 'default'];
    const RightIconComponent = RightIcon || DefaultRightIcon;
    const inputClasses = cn(
      inputCVA({ size, variant, className }),
      Icon && 'pl-10',
      RightIconComponent && 'pr-10'
    );

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon color={variant} size="md" />
          </div>
        )}
        <input className={inputClasses} ref={ref} {...props} />
        {RightIconComponent && (
          <div
            className={`absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400`}
          >
            <RightIconComponent color={variant} size="md" />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputSizes, inputBorderVariants };
