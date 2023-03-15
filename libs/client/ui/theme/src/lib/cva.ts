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

export const iconPaddingsLeft = {
  xs: 'pl-1 md:pl-2',
  sm: 'pl-2 md:pl-3',
  md: 'pl-3 md:pl-4',
  lg: 'pl-4 md:pl-5',
  xl: 'pl-5 md:pl-6',
};

export const iconPaddingsRight = {
  xs: 'pr-1 md:pr-2',
  sm: 'pr-2 md:pr-3',
  md: 'pr-3 md:pr-4',
  lg: 'pr-4 md:pr-5',
  xl: 'pr-5 md:pr-6',
};

export const iconCVA = cva('', {
  variants: {
    size: iconSizes,
  },
  defaultVariants: {
    size: 'md',
  },
});

export const iconCVAWithPadding = cva('', {
  variants: {
    size: iconSizes,
    paddingLeft: iconPaddingsLeft,
    paddingRight: iconPaddingsRight,
  },
  defaultVariants: {
    size: 'md',
    paddingLeft: null,
    paddingRight: null,
  },
});

export type IconProps = VariantProps<typeof iconCVA>;
