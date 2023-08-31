import {
  FillWarning,
  OutlineWarning,
  OutlineSuccess,
  FillSuccess,
  FillInfo,
  OutlineError,
} from '@ui/icons';

export type StatusVariantState =
  | 'default'
  | 'info'
  | 'failure'
  | 'warning'
  | 'success'
  | 'disabled';

// Omit disabled from the list of variants
export type StatusVariant = Omit<
  Record<StatusVariantState, string>,
  'disabled'
>;

const statusVariantIcons = {
  default: null,
  info: <FillInfo />,
  destructive: <OutlineWarning />,
  failure: <OutlineError />,
  warning: <FillWarning />,
  success: <OutlineSuccess />,
};

const statusBorderVariants = {
  default: 'border',
  info: 'border-info-border',
  failure: 'border-failure-border',
  warning: 'border-warning-border',
  success: 'border-success-border',
};

const statusTextColorVariants = {
  default: '',
  info: 'text-info-foreground',
  failure: 'text-failure-foreground',
  warning: 'text-warning-foreground',
  success: 'text-success-foreground',
};

const statusBgColorVariants = {
  default: '',
  info: 'bg-info-foreground',
  failure: 'bg-failure-foreground',
  warning: 'bg-warning-foreground',
  success: 'bg-success-foreground',
};

export {
  statusVariantIcons,
  statusBorderVariants,
  statusTextColorVariants,
  statusBgColorVariants,
};
