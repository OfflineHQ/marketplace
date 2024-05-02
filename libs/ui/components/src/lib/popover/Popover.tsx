'use client';

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Close } from '@ui/icons';
import * as React from 'react';
import { arrowClasses } from '../shared/arrow';
import { closeClasses } from '../shared/close';

import { cn } from '@ui/shared';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(
  (
    { className, align = 'center', sideOffset = 4, children, ...props },
    ref,
  ) => {
    const childrenArray = React.Children.toArray(children);
    const shouldBeClosable = childrenArray.some(
      (child) => React.isValidElement(child) && child.type === PopoverHeader,
    );
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            'z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
            className,
          )}
          {...props}
        >
          {children}
          {shouldBeClosable && (
            <PopoverPrimitive.Close
              data-testid="popover-close"
              className={closeClasses}
            >
              <Close />
            </PopoverPrimitive.Close>
          )}
          <PopoverPrimitive.Arrow className={arrowClasses} />
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    );
  },
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col space-y-2 pb-3 text-center sm:text-left',
      className,
    )}
    {...props}
  />
);
PopoverHeader.displayName = 'PopoverHeader';

const PopoverTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className={cn('font-medium leading-none', className)} {...props}>
    {props.children}
  </h4>
);
PopoverTitle.displayName = 'PopoverTitle';

const PopoverDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm', className)} {...props} />
);
PopoverDescription.displayName = 'PopoverDescription';

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
};
