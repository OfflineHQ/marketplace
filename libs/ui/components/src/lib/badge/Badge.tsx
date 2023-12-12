/* eslint-disable react/jsx-pascal-case */
import { IconProps } from '@ui/icons';
import { backgroundColors, cn, textColors } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';

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
  blue: textColors.blue + ' ' + backgroundColors.blue,
  dark: textColors.dark + ' ' + backgroundColors.dark,
  red: textColors.red + ' ' + backgroundColors.red,
  green: textColors.green + ' ' + backgroundColors.green,
  yellow: textColors.yellow + ' ' + backgroundColors.yellow,
  orange: textColors.orange + ' ' + backgroundColors.orange,
  indigo: textColors.indigo + ' ' + backgroundColors.indigo,
  purple: textColors.purple + ' ' + backgroundColors.purple,
  pink: textColors.pink + ' ' + backgroundColors.pink,
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
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariantsCva> {
  icon?: React.ReactElement<IconProps>;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size = 'default', children, icon, ...props }, ref) => {
    const Icon = icon;
    const iconOnly = !children && Icon;

    const baseClasses = badgeVariantsCva({ variant, size, className });
    const iconClasses = iconOnly ? 'p-1 rounded-full' : null;
    return (
      <span
        className={cn([baseClasses, iconOnly ? iconClasses : ''])}
        ref={ref}
        {...props}
      >
        {Icon && (
          <Icon.type
            size={size}
            marginRight={iconOnly ? null : size}
            className={cn(iconOnly ? '' : iconClasses, Icon.props.className)}
            {...Icon.props}
          />
        )}
        {children && <span>{children}</span>}
      </span>
    );
  },
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
  },
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
