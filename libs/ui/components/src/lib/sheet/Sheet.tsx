'use client';

import type { DialogPortalProps, DialogProps } from '@radix-ui/react-dialog';
import * as SheetPrimitive from '@radix-ui/react-dialog';
import { ChevronBack, Close } from '@ui/icons';
import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';
import * as React from 'react';
import { ButtonSkeleton, buttonVariantsCva } from '../button/Button';
import { closeClasses } from '../shared/close';
import { TextSkeleton, TextSkeletonProps } from '../text/Text';

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

const backClasses = 'absolute z-10 ml-2 mt-2';
interface SheetPortalProps
  extends DialogPortalProps,
    VariantProps<typeof portalVariants> {}

const SheetPortal = ({ position, children, ...props }: SheetPortalProps) => (
  <SheetPrimitive.Portal {...props}>
    <div className={portalVariants({ position })}>{children}</div>
  </SheetPrimitive.Portal>
);
SheetPortal.displayName = SheetPrimitive.Portal.displayName;

const sheetVariants = cva(
  'fixed z-50 scale-100 border bg-background opacity-100 shadow-lg',
  {
    variants: {
      position: {
        top: 'w-full duration-300 animate-in slide-in-from-top',
        bottom: 'w-full duration-300 animate-in slide-in-from-bottom',
        left: 'h-full duration-300 animate-in slide-in-from-left',
        right: 'h-full duration-300 animate-in slide-in-from-right',
      },
      variant: {
        default: '',
        stickyFooter: 'flex flex-col pb-0',
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
  },
);

function isFullWidth(
  position?: SheetContentProps['position'],
  size?: SheetContentProps['size'],
): boolean {
  return (
    (['left', 'right'].includes(position as string) || !position) &&
    ['full', 'content'].includes(size as string)
  );
}

export interface SheetNavigationProps {
  backButtonText?: React.ReactNode;
  wrapper?: React.ReactElement;
  backButtonAction?: () => void;
  position?: SheetContentProps['position'];
  size?: SheetContentProps['size'];
}

const SheetNavigation: React.FC<SheetNavigationProps> = ({
  backButtonText,
  wrapper,
  backButtonAction,
  position,
  size,
}) => {
  const renderButton = (buttonType: string) => {
    const closeButtonClasses = buttonVariantsCva({
      variant: buttonType === 'close' ? 'ghost' : 'secondary',
      size: 'sm',
    });
    const classNames = cn(
      buttonType === 'close' ? closeClasses : backClasses,
      closeButtonClasses,
      `${buttonType === 'close' ? 'right' : 'left'}-1 top-1`,
    );
    const testId = `sheet-${buttonType}`;
    const Icon = buttonType === 'close' ? Close : ChevronBack;
    const buttonText =
      buttonType === 'close'
        ? null
        : backButtonText && <div className="pl-2">{backButtonText}</div>;

    const button = (
      <SheetPrimitive.Close
        data-testid={testId}
        className={classNames}
        onClick={backButtonAction}
      >
        <Icon size={buttonType === 'close' ? 'lg' : 'sm'} /> {buttonText}
      </SheetPrimitive.Close>
    );

    return wrapper ? React.cloneElement(wrapper, {}, button) : button;
  };

  return isFullWidth(position, size)
    ? renderButton('back')
    : renderButton('close');
};

const SheetNavigationSkeleton: React.FC<SheetNavigationProps> = ({
  position,
  size,
}) => {
  const closeButtonClasses = buttonVariantsCva({
    variant: 'ghost',
    size: 'sm',
  });

  const renderButton = (buttonType: string) => {
    const classNames = cn(
      buttonType === 'close' ? closeClasses : backClasses,
      closeButtonClasses,
      `${buttonType === 'close' ? 'right' : 'left'}-1 top-1`,
    );
    return <ButtonSkeleton className={`${classNames} w-12`} size="sm" />;
  };

  return isFullWidth(position, size)
    ? renderButton('back')
    : renderButton('close');
};

export interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ position, size, variant, className, children, ...props }, ref) => {
  return (
    <SheetPortal position={position}>
      <SheetOverlay />
      <SheetPrimitive.Content
        ref={ref}
        className={cn(sheetVariants({ position, variant, size }), className)}
        {...props}
      >
        {children}
      </SheetPrimitive.Content>
    </SheetPortal>
  );
});

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
          `flex flex-col space-y-2 text-center sm:text-left px-6 pt-6 pb-3 ${
            isFullWidth(position, size) && 'pt-16'
          }`,
          className,
        )}
        {...props}
      />
    );
  },
);
SheetHeader.displayName = 'SheetHeader';

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
      className,
    )}
    {...props}
    ref={ref}
  />
));
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
    VariantProps<typeof sheetFooterVariantsCva> {
  footerHeight?: string;
}

const SheetFooter = React.forwardRef<HTMLDivElement, SheetFooterProps>(
  (
    { children, className, variant, footerHeight = '3.25rem', ...props },
    ref,
  ) => (
    <>
      <div
        ref={ref}
        className={
          'pointer-events-none absolute z-10 h-20 w-full bg-gradient-to-t from-card to-transparent'
        }
        style={{ bottom: footerHeight }}
        {...props}
      />
      <div
        ref={ref}
        className={cn(sheetFooterVariantsCva({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </>
  ),
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
  React.ElementRef<typeof SheetPrimitive.Title>,
  TextSkeletonProps
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
  React.ElementRef<typeof SheetPrimitive.Description>,
  TextSkeletonProps
>(({ className, ...props }, ref) => (
  <TextSkeleton className={className} variant="p" {...props} />
));
SheetDescriptionSkeleton.displayName = 'SheetDescriptionSkeleton';
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetDescriptionSkeleton,
  SheetFooter,
  SheetHeader,
  SheetNavigation,
  SheetNavigationSkeleton,
  SheetOverflow,
  SheetOverlay,
  SheetTitle,
  SheetTitleSkeleton,
  SheetTrigger,
  type DialogProps as SheetProps,
};
