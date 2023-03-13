import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';

export const iconCVA = cva('', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type IconProps = VariantProps<typeof iconCVA>;
