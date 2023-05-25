'use client';

import * as React from 'react';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { TextSkeleton, Text } from '../text/Text';
import type { DialogPortalProps, DialogProps } from '@radix-ui/react-dialog';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@ui/shared';
import { Close, ChevronBack } from '@ui/icons';
import { closeClasses } from '../shared/close';
import { backClasses } from '../shared/back';
import { Button, ButtonSkeleton, buttonVariantsCva } from '../button/Button';
import Link, { type LinkProps } from 'next/link';

const Sheet = SheetPrimitive.Root;

const SheetTrigger = SheetPrimitive.Trigger;

const portalVariants = cva('fixed inset-0 z-50 flex', {
  variants: {
    position: {
      top: 'items-start',
      bottom: 'items-end',
      left: 'justify-start',
      right: 'justify-end',
    },
  },
  defaultVariants: { position: 'right' },
});

interface SheetPortalProps
  extends DialogPortalProps,
    VariantProps<typeof portalVariants> {}

const SheetPortal = ({
  position,
  className,
  children,
  ...props
}: SheetPortalProps) => (
  <SheetPrimitive.Portal className={cn(className)} {...props}>
    <div className={portalVariants({ position })}>{children}</div>
  </SheetPrimitive.Portal>
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const sheetVariants = cva(
  'fixed z-50 scale-100 gap-4 border bg-background opacity-100 shadow-lg',
  {
    variants: {
      position: {
        top: 'w-full animate-in slide-in-from-top duration-300',
        bottom: 'w-full animate-in slide-in-from-bottom duration-300',
        left: 'h-full animate-in slide-in-from-left duration-300',
        right: 'h-full animate-in slide-in-from-right duration-300',
      },
      variant: {
        default: '',
        stickyFooter: 'relative flex flex-col pb-0',
      },
      size: {
        content: '',
        default: '',
        lg: '',
        full: '',
      },
    },
    compoundVariants: [
      {
        position: ['top', 'bottom'],
        size: 'content',
        class: 'max-h-screen',
      },
      {
        position: ['top', 'bottom'],
        size: ['lg', 'default'],
        class: 'max-h-screen',
      },
      {
        position: ['top', 'bottom'],
        size: 'full',
        class: 'h-screen',
      },
      {
        position: ['right', 'left'],
        size: 'content',
        class: 'max-w-screen',
      },
      {
        position: ['right', 'left'],
        size: 'default',
        class: 'w-screen md:w-1/2 lg:w-1/3',
      },
      {
        position: ['right', 'left'],
        size: 'lg',
        class: 'w-screen md:w-3/5 lg:w-2/3',
      },
      {
        position: ['right', 'left'],
        size: 'full',
        class: 'w-screen',
      },
    ],
    defaultVariants: {
      position: 'right',
      variant: 'default',
      size: 'default',
    },
  }
);

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {
  backButtonText?: string;
  backButtonLink?: LinkProps;
  loading?: boolean;
}

function isFullWidth(
  position?: SheetContentProps['position'],
  size?: SheetContentProps['size']
): boolean {
  return (
    (['left', 'right'].includes(position as string) || !position) &&
    ['full', 'content'].includes(size as string)
  );
}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      position,
      size,
      variant,
      className,
      children,
      backButtonText,
      backButtonLink,
      loading,
      ...props
    },
    ref
  ) => {
    const closeButtonClasses = buttonVariantsCva({
      variant: 'ghost',
      size: 'sm',
    });

    const renderCloseButton = (buttonType: string) => {
      const classNames = cn(
        buttonType === 'close' ? closeClasses : backClasses,
        closeButtonClasses,
        `${buttonType === 'close' ? 'right' : 'left'}-1 top-1`
      );
      const testId = `sheet-${buttonType}`;
      const Icon = buttonType === 'close' ? Close : ChevronBack;
      const buttonText =
        buttonType === 'close'
          ? null
          : backButtonText && <div className="pl-2">{backButtonText}</div>;

      return !loading ? (
        <SheetPrimitive.Close data-testid={testId} className={classNames}>
          <Icon /> {buttonText}
        </SheetPrimitive.Close>
      ) : (
        <ButtonSkeleton className={`${classNames} w-12`} size="sm" />
      );
    };
    return (
      <SheetPortal position={position}>
        <SheetOverlay />
        <SheetPrimitive.Content
          ref={ref}
          className={cn(sheetVariants({ position, variant, size }), className)}
          {...props}
        >
          {children}
          {backButtonLink && !loading ? (
            <Link {...backButtonLink} passHref>
              {isFullWidth(position, size)
                ? renderCloseButton('back')
                : renderCloseButton('close')}
            </Link>
          ) : isFullWidth(position, size) ? (
            renderCloseButton('back')
          ) : (
            renderCloseButton('close')
          )}
        </SheetPrimitive.Content>
      </SheetPortal>
    );
  }
);

SheetContent.displayName = SheetPrimitive.Content.displayName;

export interface SheetHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: SheetContentProps['position'];
  size?: SheetContentProps['size'];
}

const SheetHeader = React.forwardRef<HTMLDivElement, SheetHeaderProps>(
  ({ className, position, size, ...props }, ref) => {
    return (
      <div
        className={cn(
          `flex flex-col space-y-2 text-center sm:text-left px-6 pt-6 ${
            isFullWidth(position, size) && 'pt-12 md:pt-14'
          }`,
          className
        )}
        {...props}
      />
    );
  }
);
SheetHeader.displayName = 'SheetHeader';

export interface SheetOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  footerHeight?: string;
  className?: string;
}

const SheetOverlay = React.forwardRef<HTMLDivElement, SheetOverlayProps>(
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
SheetOverlay.displayName = 'SheetOverlay';

const SheetOverflow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('overflow-y-auto px-6', className)} {...props} />
));
SheetOverflow.displayName = 'SheetOverflow';

const footerVariants = {
  default: 'p-6 pt-0 relative',
  sticky: 'mt-auto pb-3 pt-0 px-6 relative',
};

const sheetFooterVariantsCva = cva('flex flex-col-reverse', {
  variants: {
    variant: footerVariants,
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface SheetFooterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sheetFooterVariantsCva> {}

const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(sheetFooterVariantsCva({ variant }), className)}
      {...props}
    >
      {props.children}
    </div>
  )
);

SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold text-foreground', className)}
    {...props}
  >
    {props.children}
  </SheetPrimitive.Title>
));
SheetTitle.displayName = SheetPrimitive.Title.displayName;

const SheetTitleSkeleton = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <TextSkeleton className={className} variant="h3" {...props} />
));
SheetTitleSkeleton.displayName = 'SheetTitleSkeleton';

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

const SheetDescriptionSkeleton = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <TextSkeleton className={className} variant="p" {...props} />
));
SheetDescriptionSkeleton.displayName = 'SheetDescriptionSkeleton';
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetOverlay,
  SheetOverflow,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetTitleSkeleton,
  SheetDescription,
  SheetDescriptionSkeleton,
  type DialogProps as SheetProps,
};
