import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@client/ui/shared';
import { IconProps } from '../icons/variants';

const sizes = {
  sm: 'text-xs px-2.5 py-0.5',
  md: 'text-sm px-2.5 py-0.5',
  lg: 'text-lg px-2.5 py-0.5',
};

const variants = {
  default: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  dark: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

const badgeVariants = cva(
  'inline-flex items-center font-medium mr-2 rounded-full transition-colors',
  {
    variants: {
      variant: variants,
      size: sizes,
    },
    defaultVariants: {
      variant: 'default',
      size: 'sm',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.FC<IconProps>;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, icon, ...props }, ref) => {
    const Icon = icon;
    const iconOnly = !children && Icon;

    const baseClasses = badgeVariants({ variant, size, className });
    const iconClasses = iconOnly ? 'p-1 rounded-full' : 'mr-1';
    return (
      <span
        className={cn([baseClasses, iconOnly ? iconClasses : ''])}
        ref={ref}
        {...props}
      >
        {Icon && <Icon size={size} className={iconOnly ? '' : iconClasses} />}
        {children && <span>{children}</span>}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

export { Badge, sizes, variants, badgeVariants };
