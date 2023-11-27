import { ButtonSkeleton } from '@ui/components';
import React from 'react';
import {
  SocialMediaButton,
  SocialMediaButtonProps,
} from '../SocialMediaButton/SocialMediaButton';

export interface SocialMediaButtonsProps
  extends Omit<SocialMediaButtonProps, 'platform' | 'handle'> {
  platforms: Pick<SocialMediaButtonProps, 'platform' | 'handle'>[];
  className?: string;
}

export const SocialMediaButtons: React.FC<SocialMediaButtonsProps> = ({
  platforms,
  className,
  ...props
}) => (
  <div className={`flex flex-wrap items-start ${className}`}>
    {platforms.map((item, index) => (
      <div className="mr-4" key={index}>
        <SocialMediaButton key={index} {...item} {...props} />
      </div>
    ))}
  </div>
);

export const SocialMediaButtonsSkeleton: React.FC<{ numItems: number }> = ({
  numItems,
}) => (
  <div className={`flex flex-wrap items-start`}>
    {Array.from({ length: numItems }, (_, index) => (
      <div className="mr-8" key={index}>
        <ButtonSkeleton isIconOnly size="sm" />
      </div>
    ))}
  </div>
);
