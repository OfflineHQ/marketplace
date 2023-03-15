import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
// import { UISizes } from '@client/ui/shared';

export const iconSizes = {
  xs: 'w-3 h-3 md:w-4 md:h-4',
  sm: 'w-4 h-4 md:w-5 md:h-5',
  md: 'w-5 h-5 md:w-6 md:h-6',
  lg: 'w-7 h-7 md:w-8 md:h-8',
  xl: 'w-8 h-8 md:w-10 md:h-10',
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
