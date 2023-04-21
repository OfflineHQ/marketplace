// Text.tsx

import * as React from 'react';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';

const textVariants = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-bold',
  h3: 'text-2xl font-semibold',
  h4: 'text-xl font-semibold',
  h5: 'text-lg font-medium',
  h6: 'text-base font-medium',
  p: 'text-base',
  span: 'text-base',
  small: 'text-sm',
};

const textLoaderVariants = {
  h1: 'h-7 min-w-[10rem] md:min-w-[16rem]',
  h2: 'h-6 min-w-[8rem] md:min-w-[14rem]',
  h3: 'h-5 min-w-[6rem] md:min-w-[12rem]',
  h4: 'h-4 min-w-[5rem] md:min-w-[10rem]',
  h5: 'h-3 min-w-[4rem] md:min-w-[8rem]',
  h6: 'h-2.5 min-w-[3.5rem] md:min-w-[6rem]',
  p: 'h-2 min-w-[3rem] md:min-w-[5rem]',
  span: 'h-2 min-w-[3rem] md:min-w-[5rem]',
  small: 'h-1 min-w-[2.5rem] md:min-w-[4rem]',
};

const textVariantClasses = cva('', {
  variants: {
    variant: textVariants,
  },
  defaultVariants: {
    variant: 'span',
  },
});

const textLoaderVariantClasses = cva(
  'max-w-full animate-pulse rounded-full bg-slate-100 dark:bg-slate-700',
  {
    variants: {
      variant: textLoaderVariants,
    },
    defaultVariants: {
      variant: 'span',
    },
  }
);

type AllowedHtmlElements =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'small';

interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariantClasses> {}

const Text: React.FC<TextProps> = ({ variant = 'span', ...props }) => {
  const Component = variant as AllowedHtmlElements;
  const className = cn(textVariantClasses({ variant }), props.className);

  return <Component className={className} {...props} />;
};

interface TextLoaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textLoaderVariantClasses> {}

const TextLoader: React.FC<TextLoaderProps> = ({
  variant = 'span',
  className,
  ...props
}) => {
  const Component = variant as AllowedHtmlElements;
  const classNames = cn(textLoaderVariantClasses({ variant }), className);

  return <Component className={classNames} {...props} />;
};

export { Text, TextLoader, type TextProps, type TextLoaderProps, textVariants };
