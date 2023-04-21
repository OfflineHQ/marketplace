'use client';

import React, { ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

import { cn } from '@ui/shared';
import { arrowClasses } from '../shared/arrow';
import { cva, VariantProps } from 'class-variance-authority';

export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  [key: string]: any; // This line is for any other props that might be passed to the component
}

export function Tooltip({
  children,
  content,
  open,
  defaultOpen,
  onOpenChange,
  className,
  sideOffset = 4,
  ref,
  ...props
}: TooltipProps) {
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={cn(
            'animate-in fade-in-50 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 z-50 overflow-hidden rounded-md border border-slate-100 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-md dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400',
            className
          )}
          {...props}
        >
          {content}
          <TooltipPrimitive.Arrow className={arrowClasses} />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

export interface TooltipWrapperProps {
  helperText?: ReactNode;
  children: React.ReactNode;
}

export function TooltipWrapper({ helperText, children }: TooltipWrapperProps) {
  // eslint-disable-next-line react/jsx-no-useless-fragment
  if (!helperText) return <>{children}</>;
  return (
    <Tooltip content={helperText} className="inline-block">
      <div className="relative inline-block">{children}</div>
    </Tooltip>
  );
}
