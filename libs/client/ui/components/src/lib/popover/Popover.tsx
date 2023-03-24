'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { Close } from '@client/ui/icons';
import { closeClasses } from '../shared/close';
import { arrowClasses } from '../shared/arrow';

import { cn } from '@client/ui/shared';

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = 'center', sideOffset = 4, children, ...props }, ref) => {
  const childrenArray = React.Children.toArray(children);
  const shouldBeClosable = childrenArray.some(
    (child) => React.isValidElement(child) && child.type === PopoverHeader
  );
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2 data-[side=right]:slide-in-from-left-2 data-[side=left]:slide-in-from-right-2 z-50 w-72 rounded-md border border-slate-100 bg-white p-4 shadow-md outline-none dark:border-slate-800 dark:bg-slate-800',
          className
        )}
        {...props}
      >
        {children}
        {shouldBeClosable && (
          <PopoverPrimitive.Close data-testid="popover-close" className={closeClasses}>
            <Close size="md" />
          </PopoverPrimitive.Close>
        )}
        <PopoverPrimitive.Arrow className={arrowClasses} />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
});
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

const PopoverHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col space-y-2 text-center sm:text-left pb-3', className)}
    {...props}
  />
);
PopoverHeader.displayName = 'PopoverHeader';

const PopoverTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h4 className={cn('font-medium leading-none', className)} {...props} />
);
PopoverTitle.displayName = 'PopoverTitle';

const PopoverDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn('text-sm text-slate-500', 'dark:text-slate-400', className)}
    {...props}
  />
);
PopoverDescription.displayName = 'PopoverDescription';

export {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
};
