import { Link } from '@next/navigation';
import { PropsFrom } from '@next/types';
import { Button, ButtonSkeleton } from '@ui/components';
import { ChevronBack } from '@ui/icons';
import { cn } from '@ui/shared';
import React from 'react';

export interface AppContainerNavBackProps {
  text: string;
  href: PropsFrom<typeof Link>;
}

export const AppContainerNavBack: React.FC<AppContainerNavBackProps> = ({
  text,
  href,
}) => (
  <div className="absolute z-10 ml-2 mt-2 md:top-12 md:ml-3 md:mt-3">
    <Link {...href} legacyBehavior>
      <Button size="sm" variant="secondary" icon={<ChevronBack />}>
        {text}
      </Button>
    </Link>
  </div>
);

export const AppContainerNavBackSkeleton: React.FC = () => {
  return (
    <ButtonSkeleton
      size="sm"
      className={`absolute z-10 ml-2 mt-2 md:top-12 md:ml-3 md:mt-3`}
    />
  );
};

export type AppContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const AppContainer = React.forwardRef<HTMLDivElement, AppContainerProps>(
  ({ className, ...props }, ref) => (
    <section
      ref={ref}
      className={cn('container flex h-full flex-col px-6 py-0', className)}
      {...props}
    />
  ),
);

AppContainer.displayName = 'AppContainer';

export const AppContainerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6 md:pt-20', className)}
    {...props}
  />
));
AppContainerHeader.displayName = 'AppContainerHeader';

export type AppContainerFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const AppContainerFooter = React.forwardRef<
  HTMLDivElement,
  AppContainerFooterProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute bottom-16 mb-0 flex w-full max-w-[2160px] items-center justify-center bg-background/95 px-6 pb-0 pt-2 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 md:bottom-0 md:pb-2 md:backdrop-blur-sm',
      className,
    )}
    {...props}
  />
));

AppContainerFooter.displayName = 'AppContainerFooter';
