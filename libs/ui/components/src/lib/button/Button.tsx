'use client';

import { useState } from 'react';
import { iconCVA, IconProps } from '@ui/icons';

import { Spinner } from '../spinner/Spinner';
import { TooltipWrapper } from '../tooltip/Tooltip';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@ui/shared';

const sizes = {
  sm: 'h-9 px-3 text-sm',
  default: 'h-10 py-2 px-4 text-sm',
  lg: 'h-11 px-6 md:px-8 text-base',
};

const variants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'underline-offset-4 hover:underline text-primary',
};

const buttonVariantsCva = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: variants,
      size: sizes,
      isIconOnly: {
        true: 'rounded-full p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
    },
    compoundVariants: Object.keys(variants).map((key) => ({
      variant: key as keyof typeof variants,
      isIconOnly: true,
      class: 'rounded-full',
    })),
  }
);

const SkeletonSizes = {
  sm: 'h-9 w-24',
  default: 'h-10 w-28',
  lg: 'h-11 w-32',
};

const buttonSkeletonVariantsCva = cva(
  'max-w-full shrink-0 animate-pulse rounded-md bg-muted',
  {
    variants: {
      size: SkeletonSizes,
    },
    defaultVariants: {
      size: 'default',
    },
  }
);

interface ButtonSkeletonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonSkeletonVariantsCva> {}

const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'default',
  className,
  ...props
}) => {
  const classNames = cn(buttonSkeletonVariantsCva({ size }), className);

  return <div className={classNames} />;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariantsCva> {
  isLoading?: boolean;
  icon?: React.FC<IconProps>;
  iconRight?: React.FC<IconProps>;
  helperText?: React.ReactNode; // Add helperText here
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'default',
      children,
      onClick,
      isLoading,
      icon,
      iconRight,
      helperText,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const _loading = isLoading || loading;
    const hasChildren = typeof children !== 'undefined';
    const isIconOnly = !hasChildren && !!(icon || iconRight);

    const handleClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      if (onClick && !_loading) {
        try {
          setLoading(true);
          await onClick(event); // <-- Change action to onClick here
        } finally {
          setLoading(false);
        }
      }
    };
    const content = () => {
      const [LeftIcon, RightIcon] = [icon, iconRight];
      const _iconLeft = iconCVA({
        size,
        marginRight: !isIconOnly ? size : null,
        margin: isIconOnly ? size : null,
      });
      const _iconRight = iconCVA({
        size,
        marginLeft: !isIconOnly ? size : null,
        margin: isIconOnly ? size : null,
      });
      return (
        <>
          {_loading ? (
            <Spinner className={_iconLeft} variant={variant} size={size} />
          ) : null}
          {LeftIcon && !_loading ? <LeftIcon className={_iconLeft} /> : null}
          {typeof children !== 'undefined' && children}
          {RightIcon ? <RightIcon className={_iconRight} /> : null}
        </>
      );
    };
    const loadingClasses = _loading ? 'cursor-not-allowed' : '';
    const buttonClasses = buttonVariantsCva({
      variant,
      size,
      isIconOnly,
      className,
    });
    return (
      <TooltipWrapper helperText={helperText}>
        <button
          className={cn(loadingClasses, buttonClasses)}
          ref={ref}
          {...props}
          onClick={handleClick}
        >
          {content()}
        </button>
      </TooltipWrapper>
    );
  }
);
Button.displayName = 'Button';

export {
  Button,
  sizes as buttonSizes,
  variants as buttonVariants,
  buttonVariantsCva,
  ButtonSkeleton,
  type ButtonSkeletonProps,
};
