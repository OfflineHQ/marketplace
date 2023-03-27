// AccessibleIcon.tsx
import { FC } from 'react';
import { IconProps, iconCVA } from './variants';
import { IconType } from 'react-icons';
import { cn } from '@client/ui/shared';

interface AccessibleIconProps extends IconProps {
  IconComponent: IconType;
  label: string;
}

export const AccessibleIcon: FC<AccessibleIconProps> = ({
  IconComponent,
  label,
  className,
  size = 'sm',
  color = null,
  ...rest
}) => {
  const iconClasses = iconCVA({ ...rest, size, color, className });
  return (
    <IconComponent aria-label={label} focusable="false" className={cn(iconClasses)} />
  );
};
