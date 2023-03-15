import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
// import { UISizes } from '@client/ui/shared';

export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const iconCVA = cva('', {
  variants: {
    size: iconSizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconProps = VariantProps<typeof iconCVA>;
