import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';
import React from 'react';

export type AppContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const AppContainer = React.forwardRef<HTMLDivElement, AppContainerProps>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('container flex h-full flex-col px-6 py-0', className)}
      {...props}
    />
  ),
);

AppContainer.displayName = 'AppContainer';

const appContainerOverflowVariants = {
  default: 'pb-14 md:pb-0 ',
  stickyFooter: 'pb-24 md:pb-12',
};

const appContainerOverflowVariantsCva = cva('overflow-y-auto md:pt-14', {
  variants: {
    variant: appContainerOverflowVariants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AppContainerOverflowProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof appContainerOverflowVariantsCva> {}

export const AppContainerOverflow = React.forwardRef<
  HTMLDivElement,
  AppContainerOverflowProps
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(appContainerOverflowVariantsCva({ variant }), className)}
    {...props}
  />
));

AppContainerOverflow.displayName = 'AppContainerOverflow';

export type AppContainerFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const AppContainerFooter = React.forwardRef<
  HTMLDivElement,
  AppContainerFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex justify-center items-center mt-auto absolute bottom-16 md:bottom-0 md:pb-2 mb-0 min-w-[100%] pt-2 px-6 pb-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className,
    )}
    {...props}
  />
));

AppContainerFooter.displayName = 'AppContainerFooter';
