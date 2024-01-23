'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import * as React from 'react';

import { cn } from '@ui/shared';
import { VariantProps, cva } from 'class-variance-authority';

const avatarSizes = {
  xs: 'size-7 sm:size-8 text-xs',
  sm: 'size-8 sm:size-10 text-sm',
  default: 'size-10 sm:size-12 text-base',
  lg: 'size-12 sm:size-16 text-lg',
  xl: 'size-16 sm:size-20 text-xl',
  '2xl': 'size-20 sm:size-24 text-2xl',
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
    className={cn('aspect-square size-full', className)}
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
      'flex size-full items-center justify-center rounded-full bg-muted',
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

const avatarSkeletonVariants = cva(
  'relative shrink-0 animate-pulse rounded-full bg-skeleton',
  {
    variants: {
      size: avatarSizes,
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

const AvatarSkeleton = React.forwardRef<
  HTMLDivElement,
  VariantProps<typeof avatarSkeletonVariants> & {
    className?: string;
  }
>(({ className, size, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(avatarSkeletonVariants({ size }), className)}
    {...props}
  />
));
AvatarSkeleton.displayName = 'AvatarSkeleton';

export { Avatar, AvatarFallback, AvatarImage, AvatarSkeleton, avatarSizes };
