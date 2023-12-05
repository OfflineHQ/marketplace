'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';

const avatarSizes = {
  xs: 'w-7 h-7 sm:w-8 sm:h-8 text-xs',
  sm: 'w-8 h-8 sm:w-10 sm:h-10 text-sm',
  default: 'w-10 h-10 sm:w-12 sm:h-12 text-base',
  lg: 'w-12 h-12 sm:w-16 sm:h-16 text-lg',
  xl: 'w-16 h-16 sm:w-20 sm:h-20 text-xl',
  '2xl': 'w-20 h-20 sm:w-24 sm:h-24 text-2xl',
};

const avatarVariants = cva(
  'relative flex shrink-0 overflow-hidden rounded-full',
  {
    variants: {
      size: avatarSizes,
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

export interface AvatarProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
      'size'
    >,
    VariantProps<typeof avatarVariants> {}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      avatarVariants({ size }),
      'relative flex-shrink-0',
      className,
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn('aspect-square h-full w-full', className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> & {
    size?: keyof typeof avatarSizes;
  }
>(({ className, size = 'default', ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const avatarSkeletonVariants = cva(
  'relative shrink-0 animate-pulse rounded-full',
  {
    variants: {
      size: avatarSizes,
      color: {
        default: 'bg-muted',
        highlight: 'bg-highlight',
      },
    },
    defaultVariants: {
      size: 'default',
      color: 'default',
    },
  },
);

const AvatarSkeleton = React.forwardRef<
  HTMLDivElement,
  VariantProps<typeof avatarSkeletonVariants> & {
    className?: string;
  }
>(({ className, size, color = 'default', ...props }, ref) => (
  <div
    ref={ref}
    className={cn(avatarSkeletonVariants({ size, color }), className)}
    {...props}
  />
));
AvatarSkeleton.displayName = 'AvatarSkeleton';

export { Avatar, AvatarFallback, AvatarImage, AvatarSkeleton, avatarSizes };
