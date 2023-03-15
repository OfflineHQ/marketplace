import * as React from 'react';
import { cn } from '@client/ui/shared';
import { cva, VariantProps } from 'class-variance-authority';
import { AiFillWarning, AiFillCheckCircle, AiFillInfoCircle } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';

const sizes = {
  sm: 'py-2 px-3 text-sm',
  md: 'py-3 px-4 text-sm',
  lg: 'py-4 px-5 text-sm',
};

const variants = {
  default: 'border-slate-300 dark:border-slate-700',
  info: 'border-blue-500 dark:border-blue-700',
  failure: 'border-red-500 dark:border-red-700',
  warning: 'border-yellow-500 dark:border-yellow-700',
  success: 'border-green-500 dark:border-green-700',
};

const variantIcons = {
  default: { Icon: null, color: '' },
  info: { Icon: AiFillInfoCircle, color: 'text-blue-500 dark:text-blue-700' },
  failure: { Icon: MdOutlineError, color: 'text-red-500 dark:text-red-700' },
  warning: { Icon: AiFillWarning, color: 'text-yellow-500 dark:text-yellow-700' },
  success: { Icon: AiFillCheckCircle, color: 'text-green-500 dark:text-green-700' },
};

const inputVariants = cva(
  'border block w-full rounded-md bg-transparent placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-50 dark:focus:ring-offset-slate-900',
  {
    variants: {
      size: sizes,
      variant: variants,
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  rightIcon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, variant, icon: Icon, rightIcon: RightIcon, ...props }, ref) => {
    const { Icon: DefaultRightIcon, color: rightIconColor } =
      variantIcons[variant || 'default'];
    const RightIconComponent = RightIcon || DefaultRightIcon;
    const inputClasses = cn(
      inputVariants({ size, variant, className }),
      Icon && 'pl-10',
      RightIconComponent && 'pr-10'
    );

    return (
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input className={inputClasses} ref={ref} {...props} />
        {RightIconComponent && (
          <div
            className={`absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 ${rightIconColor}`}
          >
            <RightIconComponent className="h-5 w-5" />
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input, sizes, variants };
