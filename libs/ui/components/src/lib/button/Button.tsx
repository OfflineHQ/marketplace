'use client';

import { useState } from 'react';
import { iconCVA, IconProps } from '@ui/icons';

import { Spinner } from '../spinner/Spinner';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@ui/shared';

const sizes = {
  xs: 'text-xs px-3 py-2',
  sm: 'text-sm px-3 py-2',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-5 py-3',
  xl: 'text-base px-5 py-3',
};

const variants = {
  default:
    'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
  destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
  outline:
    'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
  subtle:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
  ghost:
    'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
  link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
};

const buttonVariantsCva = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800',
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
      size: 'md',
      isIconOnly: false,
    },
    compoundVariants: Object.keys(variants).map((key) => ({
      variant: key as keyof typeof variants,
      isIconOnly: true,
      class: 'rounded-full',
    })),
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariantsCva> {
  isLoading?: boolean;
  icon?: React.FC<IconProps>;
  iconRight?: React.FC<IconProps>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size = 'md',
      children,
      onClick,
      isLoading,
      icon,
      iconRight,
      ...props
    },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const _loading = isLoading || loading;
    const hasChildren = typeof children !== 'undefined';
    const isIconOnly = !hasChildren && !!(icon || iconRight);

    // a function that await for the onClick to be completed
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
    const buttonClasses = buttonVariantsCva({ variant, size, isIconOnly, className });
    return (
      <button
        className={cn(loadingClasses, buttonClasses)}
        ref={ref}
        {...props}
        onClick={handleClick}
      >
        {content()}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, sizes as buttonSizes, variants as buttonVariants, buttonVariantsCva };
