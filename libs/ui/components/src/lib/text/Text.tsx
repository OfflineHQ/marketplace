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

const textSkeletonVariants = {
  h1: 'h-7 w-[10rem] md:w-[16rem]',
  h2: 'h-6 w-[8rem] md:w-[14rem]',
  h3: 'h-5 w-[6rem] md:w-[12rem]',
  h4: 'h-4 w-[5rem] md:w-[10rem]',
  h5: 'h-3 w-[4rem] md:w-[8rem]',
  h6: 'h-2.5 w-[3.5rem] md:w-[6rem]',
  p: 'h-2 w-[3rem] md:w-[5rem]',
  span: 'h-2 w-[3rem] md:w-[5rem]',
  small: 'h-1 w-[2.5rem] md:w-[4rem]',
};

const textVariantClasses = cva('', {
  variants: {
    variant: textVariants,
  },
  defaultVariants: {
    variant: 'span',
  },
});

const textSkeletonVariantClasses = cva(
  'max-w-full shrink-0 animate-pulse rounded-full bg-muted',
  {
    variants: {
      variant: textSkeletonVariants,
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

interface TextSkeletonProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textSkeletonVariantClasses> {}

const TextSkeleton: React.FC<TextSkeletonProps> = ({
  variant = 'span',
  className,
  ...props
}) => {
  const Component = variant as AllowedHtmlElements;
  const classNames = cn(textSkeletonVariantClasses({ variant }), className);

  return <Component className={classNames} {...props} />;
};

export {
  Text,
  TextSkeleton,
  type TextProps,
  type TextSkeletonProps,
  textVariants,
};
