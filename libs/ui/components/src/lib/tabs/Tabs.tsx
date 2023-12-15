'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from '@ui/shared';
import { TextSkeleton, TextSkeletonProps } from '../text/Text';

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md distinct bg-distinct p-1 text-muted-foreground',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

const TabsTriggerSkeleton = React.forwardRef<HTMLDivElement, TextSkeletonProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5',
        className,
      )}
    >
      <TextSkeleton variant="span" {...props} />
    </div>
  ),
);
TabsTriggerSkeleton.displayName = 'TabsTriggerSkeleton';

interface TabsSkeletonProps extends TextSkeletonProps {
  numTabs: number;
}

const TabsSkeleton: React.FC<TabsSkeletonProps> = ({
  numTabs,
  className,
  ...props
}) => (
  <Tabs className={className}>
    <TabsList>
      {Array.from({ length: numTabs }, (_, i) => (
        <TabsTriggerSkeleton key={i} {...props} />
      ))}
    </TabsList>
  </Tabs>
);

TabsSkeleton.displayName = 'TabsSkeleton';

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsSkeleton,
  TabsTrigger,
  TabsTriggerSkeleton,
};
