import * as React from 'react';

import { cn } from '@ui/shared';
import { TextSkeleton } from '../text/Text';
import { VariantProps, cva } from 'class-variance-authority';

const variants = {
  default: 'border shadow-sm',
  noBorder: '',
  stickyFooter: 'relative border shadow-sm flex flex-col h-full',
};

const cardVariantsCva = cva('rounded-lg bg-card text-card-foreground', {
  variants: {
    variant: variants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariantsCva> {
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariantsCva({ variant }), className)}
      {...props}
    />
  )
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
      className
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
  sticky: 'mt-auto pb-3 pt-0 px-6 relative',
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
  )
);

CardFooter.displayName = 'CardFooter';

export interface CardOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  footerHeight?: string;
  className?: string;
}

const CardOverlay = React.forwardRef<HTMLDivElement, CardOverlayProps>(
  ({ footerHeight = '3.25rem', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        `absolute inset-x-0 z-10 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none`,
        className
      )}
      style={{ bottom: footerHeight }}
      {...props}
    />
  )
);
CardOverlay.displayName = 'CardOverlay';

const CardOverflow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-y-auto', className)} {...props} />
));
CardOverflow.displayName = 'CardOverflow';

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardTitleSkeleton,
  CardDescriptionSkeleton,
  CardOverflow,
  CardOverlay,
};
