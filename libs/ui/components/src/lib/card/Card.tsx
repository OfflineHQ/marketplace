import * as React from 'react';

import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';
import { TextSkeleton } from '../text/Text';

const variants = {
  default: 'border shadow-sm',
  noBorder: '',
  stickyFooter: 'relative border shadow-sm flex flex-col h-full',
  distinct: 'border shadow-md bg-muted rounded-sm text-card-muted-foreground',
};

const cardVariantsCva = cva('rounded-lg bg-card text-card-foreground', {
  variants: {
    variant: variants,
    noBorder: {
      true: 'border-none shadow-none',
    },
  },
  defaultVariants: {
    variant: 'default',
    noBorder: false,
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariantsCva> {
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, noBorder, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        cardVariantsCva({ variant, noBorder: !!noBorder }),
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h3
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

const CardTitleSkeleton = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <TextSkeleton className={className} variant="h4" {...props} />
));
CardTitleSkeleton.displayName = 'CardTitleSkeleton';

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

const CardDescriptionSkeleton = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <TextSkeleton className={className} variant="p" {...props} />
));
CardDescriptionSkeleton.displayName = 'CardDescriptionSkeleton';

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0 flex-grow', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const footerVariants = {
  default: 'p-6 pt-0 relative',
  sticky:
    'mt-auto absolute bottom-16 md:pb-3 md:bottom-0 min-w-[100%] pt-2 px-6 pb-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
};

const cardFooterVariantsCva = cva('flex items-center', {
  variants: {
    variant: footerVariants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariantsCva> {}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardFooterVariantsCva({ variant }), className)}
      {...props}
    >
      {props.children}
    </div>
  ),
);

CardFooter.displayName = 'CardFooter';

const CardOverflow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-y-auto', className)} {...props} />
));
CardOverflow.displayName = 'CardOverflow';

export {
  Card,
  CardContent,
  CardDescription,
  CardDescriptionSkeleton,
  CardFooter,
  CardHeader,
  CardOverflow,
  CardTitle,
  CardTitleSkeleton,
};
