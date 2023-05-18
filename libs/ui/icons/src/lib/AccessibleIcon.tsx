// AccessibleIcon.tsx
import { FC } from 'react';
import { IconProps, iconCVA } from './variants';
import { IconType } from 'react-icons';
import { cn } from '@ui/shared';

interface AccessibleIconProps extends IconProps {
  IconComponent: IconType;
  label: string;
}

export const AccessibleIcon: FC<AccessibleIconProps> = ({
  IconComponent,
  label,
  className,
  flex = false,
  size = 'sm',
  color = null,
  ...rest
}) => {
  const iconClasses = iconCVA({ ...rest, size, color, className });
  return flex ? ( // Enforce size in case IconComponent is in a flex container that shrinken it
    <div className={cn(iconClasses, 'flex items-center justify-center')}>
      <IconComponent
        aria-label={label}
        focusable="false"
        className={cn(iconClasses)}
      />
    </div>
  ) : (
    <IconComponent
      aria-label={label}
      focusable="false"
      className={cn(iconClasses)}
    />
  );
};
