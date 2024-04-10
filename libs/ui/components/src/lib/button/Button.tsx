/* eslint-disable react/jsx-pascal-case */
'use client';

import { iconCVA, IconProps } from '@ui/icons';
import { useState } from 'react';

import { Spinner } from '../spinner/Spinner';
import { TooltipWrapper } from '../tooltip/Tooltip';

import { cva, VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@ui/shared';

const sizes = {
  default: 'h-10 px-4 py-2',
  xs: 'h-8 rounded-md px-3',
  sm: 'h-9 rounded-md px-3',
  lg: 'h-11 rounded-md px-8',
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
        true: 'h-auto rounded-full p-0',
      },
      block: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      isIconOnly: false,
      block: false,
    },
    compoundVariants: Object.keys(variants).map((key) => ({
      variant: key as keyof typeof variants,
      isIconOnly: true,
      class: 'rounded-full',
    })),
  },
);

const SkeletonSizes = {
  xs: 'size-8',
  sm: 'size-9',
  default: 'size-10',
  lg: 'size-11',
};

const buttonSkeletonVariantsCva = cva(
  'max-w-full shrink-0 animate-pulse rounded-md bg-skeleton',
  {
    variants: {
      size: SkeletonSizes,
      isIconOnly: {
        true: 'rounded-full',
      },
    },
    defaultVariants: {
      size: 'default',
      isIconOnly: false,
    },
    compoundVariants: [
      {
        size: 'xs',
        isIconOnly: false,
        class: 'h-8 w-20',
      },
      {
        size: 'sm',
        isIconOnly: false,
        class: 'h-9 w-24',
      },
      {
        size: 'default',
        isIconOnly: false,
        class: 'h-10 w-28',
      },
      {
        size: 'lg',
        isIconOnly: false,
        class: 'h-11 w-32',
      },
    ],
  },
);
interface ButtonSkeletonProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonSkeletonVariantsCva> {}

const ButtonSkeleton: React.FC<ButtonSkeletonProps> = ({
  size = 'default',
  className,
  isIconOnly,
  ...props
}) => {
  const classNames = cn(
    buttonSkeletonVariantsCva({ size, isIconOnly }),
    className,
  );

  return <div className={classNames} />;
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariantsCva> {
  isLoading?: boolean;
  icon?: React.ReactElement<IconProps>;
  iconRight?: React.ReactElement<IconProps>;
  helperText?: React.ReactNode;
}

interface ButtonContentProps extends ButtonProps {
  loading: boolean;
  isIconOnly: boolean;
  LeftIcon?: React.ReactElement<IconProps>;
  RightIcon?: React.ReactElement<IconProps>;
}

// Define the ButtonContent component
const ButtonContent: React.FC<ButtonContentProps> = ({
  loading,
  size,
  variant,
  isIconOnly,
  LeftIcon,
  RightIcon,
  children,
}) => {
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
      {loading ? (
        <Spinner
          className={`${_iconLeft} max-h-fit max-w-fit`}
          variant={variant}
          size={size}
        />
      ) : null}
      {LeftIcon && !loading ? (
        <LeftIcon.type
          {...LeftIcon.props}
          className={cn(_iconLeft, LeftIcon.props.className)}
        />
      ) : null}
      {typeof children !== 'undefined' && children}
      {RightIcon ? (
        <RightIcon.type
          {...RightIcon.props}
          className={cn(_iconRight, RightIcon.props.className)}
        />
      ) : null}
    </>
  );
};

// Use the ButtonContent component in the Button component
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'default',
      block,
      children,
      onClick,
      isLoading,
      icon,
      iconRight,
      helperText,
      ...props
    },
    ref,
  ) => {
    const [loading, setLoading] = useState(false);
    const _loading = isLoading || loading;
    const hasChildren = typeof children !== 'undefined';
    const isIconOnly = !hasChildren && !!(icon || iconRight);

    const handleClick = async (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
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

    const loadingClasses = _loading ? 'cursor-not-allowed' : '';
    const buttonClasses = buttonVariantsCva({
      variant,
      size,
      isIconOnly,
      block: !!block,
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
          <ButtonContent
            loading={_loading}
            size={size}
            variant={variant}
            isIconOnly={isIconOnly}
            LeftIcon={icon}
            RightIcon={iconRight}
          >
            {children}
          </ButtonContent>
        </button>
      </TooltipWrapper>
    );
  },
);
Button.displayName = 'Button';

export {
  Button,
  sizes as buttonSizes,
  ButtonSkeleton,
  variants as buttonVariants,
  buttonVariantsCva,
  type ButtonSkeletonProps,
};
