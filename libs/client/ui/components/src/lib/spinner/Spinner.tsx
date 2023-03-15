/* eslint-disable-next-line */
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@client/ui/shared';
import { iconCVA, IconProps } from '@client/ui/theme';
import * as React from 'react';
import { Loader2, LucideRadio } from 'lucide-react';

const variants = {
  default:
    'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
  destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
  outline:
    'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
  subtle:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
  ghost:
    ' hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
  link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
};

const spinnerVariants = cva(['animate-spin', 'bg-transparent'], {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  size?: IconProps['size'];
}

const Spinner: React.FC<SpinnerProps> = ({ size, ...rest }) => {
  const icon = iconCVA({ size });
  const spinnerClass = cn(icon, spinnerVariants(rest));

  return <Loader2 className={spinnerClass} {...rest} />;
};

export { Spinner, variants, spinnerVariants };
