'use client';

import React, { forwardRef } from 'react';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Label } from '../label/Label';
import { TooltipWrapper } from '../tooltip/Tooltip';

import { cn } from '@ui/shared';

let idCounter = 0;

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    disabled?: boolean;
    leftLabel?: React.ReactNode;
    rightLabel?: React.ReactNode;
    htmlFor?: string;
    helperText?: React.ReactNode;
  }
>(
  (
    { className, disabled, leftLabel, rightLabel, id, htmlFor, helperText, ...props },
    ref
  ) => {
    const generatedId = id || `switch-${++idCounter}`;
    const helperTextId = `${generatedId}-helper-text`;

    const switchContent = (
      <div className="relative flex items-center">
        {leftLabel && (
          <Label
            htmlFor={htmlFor || generatedId}
            className={cn('mr-2 cursor-pointer', { 'cursor-not-allowed': disabled })}
            variant={disabled ? 'disabled' : undefined}
          >
            {leftLabel}
          </Label>
        )}
        <SwitchPrimitives.Root
          className={cn(
            'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-slate-200 data-[state=checked]:bg-slate-900 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=unchecked]:bg-slate-700 dark:data-[state=checked]:bg-slate-400',
            className
          )}
          {...props}
          ref={ref}
          id={htmlFor || generatedId}
          aria-describedby={helperTextId}
          disabled={disabled}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0 data-[state=checked]:translate-x-5'
            )}
          />
        </SwitchPrimitives.Root>
        {rightLabel && (
          <Label
            htmlFor={htmlFor || generatedId}
            className={cn('ml-2 cursor-pointer', { 'cursor-not-allowed': disabled })}
            variant={disabled ? 'disabled' : undefined}
          >
            {rightLabel}
          </Label>
        )}
      </div>
    );

    return <TooltipWrapper helperText={helperText}>{switchContent}</TooltipWrapper>;
  }
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
