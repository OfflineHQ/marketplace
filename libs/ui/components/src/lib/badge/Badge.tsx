/* eslint-disable react/jsx-pascal-case */
import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@ui/shared';
import { IconProps } from '@ui/icons';

const badgeSizes = {
  sm: 'text-xs px-2.5 py-0.5',
  default: 'text-sm px-2.5 py-0.5',
  lg: 'text-lg px-2.5 py-0.5',
};

const badgeVariants = {
  default:
    'bg-primary hover:bg-primary/80 border-transparent text-primary-foreground',
  secondary:
    'bg-secondary hover:bg-secondary/80 border-transparent text-secondary-foreground',
  destructive:
    'bg-destructive hover:bg-destructive/80 border-transparent text-destructive-foreground',
  outline: 'text-foreground',
  blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  dark: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  yellow:
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  orange:
    'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  indigo:
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  purple:
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
};

const badgeVariantsCva = cva(
  'inline-flex w-max items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: badgeVariants,
      size: badgeSizes,
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariantsCva> {
  icon?: React.ReactElement<IconProps>;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, children, icon, ...props }, ref) => {
    const Icon = icon;
    const iconOnly = !children && Icon;

    const baseClasses = badgeVariantsCva({ variant, size, className });
    const iconClasses = iconOnly ? 'p-1 rounded-full' : 'mr-1';
    return (
      <span
        className={cn([baseClasses, iconOnly ? iconClasses : ''])}
        ref={ref}
        {...props}
      >
        {Icon && (
          <Icon.type
            size={size}
            className={iconOnly ? '' : iconClasses}
            {...Icon.props}
          />
        )}
        {children && <span>{children}</span>}
      </span>
    );
  }
);
Badge.displayName = 'Badge';

const SkeletonSizes = {
  sm: 'h-4 w-16',
  default: 'h-5 w-20',
  lg: 'h-7 w-24',
};

const badgeSkeletonVariantsCva = cva(
  'max-w-full shrink-0 animate-pulse rounded-full bg-muted',
  {
    variants: {
      size: SkeletonSizes,
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

export interface BadgeSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeSkeletonVariantsCva> {}

const BadgeSkeleton: React.FC<BadgeSkeletonProps> = ({
  size = 'default',
  className,
  ...props
}) => {
  const classNames = cn(badgeSkeletonVariantsCva({ size }), className);

  return <div className={classNames} {...props} />;
};

export { Badge, BadgeSkeleton, badgeSizes, badgeVariants, badgeVariantsCva };
