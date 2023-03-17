import { cva, VariantProps } from 'class-variance-authority';
import { statusTextColorVariants } from '../shared/statusVariant';

export const iconSizes = {
  xs: 'w-3.5 h-3.5 md:w-4 md:h-4',
  sm: 'w-4 h-4 md:w-5 md:h-5',
  md: 'w-5 h-5 md:w-6 md:h-6',
  lg: 'w-6 h-6 md:w-7 md:h-7',
  xl: 'w-7 h-7 md:w-8 md:h-8',
};

export const iconMarginLeft = {
  xs: 'ml-1.5',
  sm: 'ml-1.5',
  md: 'ml-2',
  lg: 'ml-2.5',
  xl: 'ml-3',
};

export const iconMarginRight = {
  xs: 'mr-1.5',
  sm: 'mr-1.5',
  md: 'mr-2',
  lg: 'mr-2.5',
  xl: 'mr-3',
};

export const iconColors = statusTextColorVariants;

export const iconCVA = cva('', {
  variants: {
    size: iconSizes,
    marginLeft: iconMarginLeft,
    marginRight: iconMarginRight,
    color: iconColors,
  },
  defaultVariants: {
    size: 'md',
    marginLeft: null,
    marginRight: null,
    color: null,
  },
});

export type IconProps = VariantProps<typeof iconCVA>;
