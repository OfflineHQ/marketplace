import { useState } from 'react';
import { iconCVA } from '@client/ui/theme';

import { Spinner } from '../spinner/Spinner';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@client/ui/shared';

const sizes = {
  xs: 'text-xs px-2 py-1',
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
  xl: 'text-base px-6 py-3',
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

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  {
    variants: {
      variant: variants,
      size: sizes,
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  action?: () => void;
  isLoading?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, children, action, isLoading, icon, iconRight, ...props },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const _loading = isLoading || loading;

    // a function that await for the action to be completed
    const handleClick = async (action: (() => void) | undefined) => {
      if (action && !_loading) {
        try {
          setLoading(true);
          await action();
        } finally {
          setLoading(false);
        }
      }
    };
    const content = () => {
      const [LeftIcon, RightIcon] = [icon, iconRight];
      const _icon = iconCVA({ size });
      return (
        <>
          {_loading ? <Spinner size="sm" /> : null}
          {LeftIcon && !_loading ? <LeftIcon className={`mr-2 ${_icon}`} /> : null}
          {typeof children !== 'undefined' && children}
          {RightIcon ? <RightIcon className={`ml-2 ${icon}`} /> : null}
        </>
      );
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={() => (!_loading ? handleClick(action) : null)}
      >
        {content()}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, sizes, variants, buttonVariants };
