import { IconProps } from '@radix-ui/react-icons/dist/types';
import { cn } from '@ui/shared';
import React from 'react';

interface IconBadgeWrapperProps {
  icon?: React.ReactElement<IconProps>;
  className?: string;
  children: React.ReactNode;
}

export const IconBadgeWrapper: React.FC<IconBadgeWrapperProps> = ({
  icon,
  className,
  children,
}) => {
  const Icon = icon;
  return (
    <div className="relative inline-block">
      {children}
      {Icon && (
        <span
          className={cn(
            'absolute right-0 top-2 z-10 -translate-y-1/2 translate-x-1/2 transform rounded-full',
            className,
          )}
        >
          <span className="flex items-center justify-center rounded-full">
            {<Icon.type {...Icon.props} />}
          </span>
        </span>
      )}
    </div>
  );
};
