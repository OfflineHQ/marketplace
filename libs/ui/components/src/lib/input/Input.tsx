/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import {
  statusVariantIcons,
  statusBorderVariants as inputBorderVariants,
} from '../shared/statusVariant';
import { IconProps } from '@ui/icons';

const inputSizes = {
  sm: 'py-1.5 text-sm h-8',
  default: 'py-2 text-sm h-10',
  lg: 'py-3 text-sm h-12',
};

const inputCVA = cva(
  'flex w-full rounded-md border border-input bg-transparent px-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: inputSizes,
      variant: inputBorderVariants,
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputCVA> {
  icon?: React.ReactElement<IconProps>;
  rightIcon?: React.ReactElement<IconProps>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      size,
      variant = 'default',
      icon: Icon,
      rightIcon: RightIcon,
      ...props
    },
    ref
  ) => {
    const DefaultRightIcon = statusVariantIcons[variant || 'default'];
    const RightIconComponent = RightIcon || DefaultRightIcon;
    const inputClasses = cn(
      inputCVA({ size, variant, className }),
      Icon && 'pl-8 md:pl-10',
      RightIconComponent && 'pr-8 md:pr-10'
    );

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <Icon.type color={variant} {...Icon.props} />
          </div>
        )}
        <input className={inputClasses} ref={ref} {...props} />
        {RightIconComponent && (
          <div
            className={`absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400`}
          >
            <RightIconComponent.type
              color={variant}
              {...RightIconComponent.props}
            />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, inputSizes, inputBorderVariants };
