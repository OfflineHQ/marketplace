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
    {
      className,
      disabled,
      leftLabel,
      rightLabel,
      id,
      htmlFor,
      helperText,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || `switch-${++idCounter}`;
    const helperTextId = `${generatedId}-helper-text`;

    const switchContent = (
      <div className="relative flex items-center">
        {leftLabel && (
          <Label
            htmlFor={htmlFor || generatedId}
            disabled={disabled}
            className={cn('mr-2 cursor-pointer')}
          >
            {leftLabel}
          </Label>
        )}
        <SwitchPrimitives.Root
          className={cn(
            'peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
            className,
          )}
          {...props}
          ref={ref}
          id={htmlFor || generatedId}
          aria-describedby={helperTextId}
          disabled={disabled}
        >
          <SwitchPrimitives.Thumb
            className={cn(
              'pointer-events-none block size-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0',
            )}
          />
        </SwitchPrimitives.Root>
        {rightLabel && (
          <Label
            htmlFor={htmlFor || generatedId}
            className={cn('ml-2 cursor-pointer')}
          >
            {rightLabel}
          </Label>
        )}
      </div>
    );

    return (
      <TooltipWrapper helperText={helperText}>{switchContent}</TooltipWrapper>
    );
  },
);
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
