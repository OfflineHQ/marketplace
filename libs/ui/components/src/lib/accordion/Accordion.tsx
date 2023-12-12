'use client';

import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDown } from '@ui/icons';
import { cn } from '@ui/shared';
import * as React from 'react';
import { TextSkeleton, TextSkeletonProps } from '../text/Text';

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, disabled, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn('border-b', disabled ? 'opacity-30' : '', className)}
    disabled={disabled}
    {...props}
  />
));
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all [&:not([data-disabled])]:hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
    )}
    {...props}
  >
    <div className={cn('pb-4 pt-0', className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

const AccordionItemSkeleton = React.forwardRef<
  HTMLDivElement,
  TextSkeletonProps
>(({ className, ...props }, ref) => (
  <div className="border-b">
    <div className="flex flex-1 items-center justify-between py-4 font-medium transition-all [&:not([data-disabled])]:hover:underline [&[data-state=open]>svg]:rotate-180">
      <TextSkeleton variant="h4" {...props} />
      <ChevronDown className="opacity-30" />
    </div>
  </div>
));
AccordionItemSkeleton.displayName = 'AccordionItemSkeleton';

interface AccordionSkeletonProps extends TextSkeletonProps {
  numItems: number;
}

const AccordionSkeleton: React.FC<AccordionSkeletonProps> = ({
  numItems,
  ...props
}) => (
  <Accordion type="single">
    {Array.from({ length: numItems }, (_, i) => (
      <AccordionItemSkeleton key={i} {...props} />
    ))}
  </Accordion>
);

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionItemSkeleton,
  AccordionSkeleton,
  AccordionTrigger,
};
