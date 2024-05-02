import { cva, VariantProps } from 'class-variance-authority';

export const iconSizes = {
  xs: 'size-3.5 md:size-4',
  sm: 'size-5',
  default: 'w-[1.2rem] h-[1.2rem] md:w-[1.35rem] md:h-[1.35rem]',
  lg: 'size-7',
  xl: 'size-9 md:size-9.5',
  auto: 'size-auto',
};

export const iconMarginLeft = {
  xs: 'ml-1.5',
  sm: 'ml-1.5',
  default: 'ml-1.5',
  lg: 'ml-2.5',
  xl: 'ml-3',
};

export const iconMarginRight = {
  xs: 'mr-1.5',
  sm: 'mr-1.5',
  default: 'mr-1.5',
  lg: 'mr-2.5',
  xl: 'mr-3',
};

export const iconMargins = {
  xs: 'm-1.5',
  sm: 'm-1.5',
  default: 'm-1.5',
  lg: 'm-2.5',
  xl: 'm-3',
};

export const iconPaddings = {
  xs: 'p-1.5',
  sm: 'p-1.5',
  default: 'p-1.5',
  lg: 'p-2.5',
  xl: 'p-3',
};

export const iconColors = {
  default: '',
  info: 'text-info-foreground',
  failure: 'text-failure-foreground',
  destructive: 'text-destructive',
  warning: 'text-warning-foreground',
  success: 'text-success-foreground',
};

export const iconCVA = cva('', {
  variants: {
    size: iconSizes,
    padding: iconPaddings,
    margin: iconMargins,
    marginLeft: iconMarginLeft,
    marginRight: iconMarginRight,
    color: iconColors,
  },
  defaultVariants: {
    size: 'default',
    padding: null,
    margin: null,
    marginLeft: null,
    marginRight: null,
    color: null,
  },
});

export type IconProps = VariantProps<typeof iconCVA> & {
  className?: string;
  flex?: boolean;
};
