// Text.tsx

import * as React from 'react';
import { cn } from '@ui/shared';
import { cva, VariantProps } from 'class-variance-authority';

const textVariants = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-medium',
  h6: 'scroll-m-20 text-base font-medium',
  p: 'text-base leading-7 [&:not(:first-child)]:mt-6',
  span: 'text-base',
  small: 'text-sm font-medium leading-none',
};

const textSkeletonVariants = {
  h1: 'h-7 w-[11rem] md:w-[17rem]',
  h2: 'h-6 w-[9rem] md:w-[15.5rem]',
  h3: 'h-5 w-[7.5rem] md:w-[12.5rem]',
  h4: 'h-4 w-[6.5rem] md:w-[10.5rem]',
  h5: 'h-3 w-[6rem] md:w-[9rem]',
  h6: 'h-2.5 w-[5.5rem] md:w-[8.5rem]',
  p: 'h-2 w-[5rem] md:w-[8rem]',
  span: 'h-2 w-[5rem] md:w-[8rem] flex',
  small: 'h-1 w-[2.5rem] md:w-[4rem] flex',
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

  return variant !== 'p' ? (
    <Component className={classNames} {...props} />
  ) : (
    <div className="flex-col space-y-1">
      <Component className={classNames} {...props} />
      <small
        className={cn(
          textSkeletonVariantClasses({ variant: 'small' }),
          className,
          'h-2'
        )}
        {...props}
      />
    </div>
  );
};

export {
  Text,
  TextSkeleton,
  type TextProps,
  type TextSkeletonProps,
  textVariants,
};
