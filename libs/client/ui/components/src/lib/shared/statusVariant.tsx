import {
  FillWarning,
  OutlineWarning,
  OutlineSuccess,
  FillSuccess,
  FillInfo,
  OutlineError,
} from '@client/ui/icons';

export type StatusVariantState =
  | 'default'
  | 'info'
  | 'failure'
  | 'warning'
  | 'success'
  | 'disabled';

// Omit disabled from the list of variants
export type StatusVariant = Omit<Record<StatusVariantState, string>, 'disabled'>;

const statusVariantIcons = {
  default: null,
  info: FillInfo,
  destructive: OutlineWarning,
  failure: OutlineError,
  warning: FillWarning,
  success: OutlineSuccess,
  disabled: null,
};

const statusBorderVariants = {
  default: 'border-slate-300 dark:border-slate-700',
  info: 'border-slate-300 dark:border-slate-700',
  failure: 'border-red-500 dark:border-red-700',
  warning: 'border-yellow-500 dark:border-yellow-700',
  success: 'border-green-500 dark:border-green-700',
  disabled: 'border-slate-100 dark:border-slate-800',
};

const statusTextColorVariants = {
  default: '',
  info: 'text-slate-700 dark:text-slate-300',
  failure: 'text-red-600 dark:text-red-500',
  warning: 'text-yellow-600 dark:text-yellow-500',
  success: 'text-green-600 dark:text-green-500',
  disabled: 'text-slate-400 dark:text-slate-600',
};

const statusBgColorVariants = {
  default: 'bg-slate-100 dark:bg-slate-900',
  info: 'bg-slate-100 dark:bg-slate-900',
  failure: 'bg-red-100 dark:bg-red-400',
  warning: 'bg-yellow-100 dark:bg-yellow-400',
  success: 'bg-green-100 dark:bg-green-400',
  disabled: 'bg-slate-200 dark:bg-slate-800',
};

export const statusBgFillVariants = {
  default: 'bg-slate-700 dark:bg-slate-300',
  info: 'bg-slate-700 dark:bg-slate-300',
  failure: 'bg-red-600 dark:bg-red-500',
  warning: 'bg-yellow-600 dark:bg-yellow-500',
  success: 'bg-green-600 dark:bg-green-500',
  disabled: 'bg-slate-400 dark:bg-slate-600',
};

export {
  statusVariantIcons,
  statusBorderVariants,
  statusTextColorVariants,
  statusBgColorVariants,
};
