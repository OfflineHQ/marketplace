import { FillWarning, FillSuccess, FillInfo, OutlineError } from '../icons';

export type StatusVariantName =
  | 'default'
  | 'info'
  | 'failure'
  | 'warning'
  | 'success'
  | 'disabled';

const statusVariantIcons = {
  default: null,
  info: FillInfo,
  failure: OutlineError,
  warning: FillWarning,
  success: FillSuccess,
  disabled: null,
};

const statusBorderVariants = {
  default: 'border-slate-300 dark:border-slate-700',
  info: 'border-blue-500 dark:border-blue-700',
  failure: 'border-red-500 dark:border-red-700',
  warning: 'border-yellow-500 dark:border-yellow-700',
  success: 'border-green-500 dark:border-green-700',
  disabled: 'border-slate-400 dark:border-slate-600',
};

const statusTextColorVariants = {
  default: 'text-slate-700 dark:text-slate-300',
  info: 'text-blue-600 dark:text-blue-500',
  failure: 'text-red-600 dark:text-red-500',
  warning: 'text-yellow-600 dark:text-yellow-500',
  success: 'text-green-600 dark:text-green-500',
  disabled: 'text-slate-400 dark:text-slate-600',
};

const statusBgColorVariants = {
  default: 'bg-slate-100 dark:bg-slate-900',
  info: 'bg-blue-100 dark:bg-blue-400',
  failure: 'bg-red-100 dark:bg-red-400',
  warning: 'bg-yellow-100 dark:bg-yellow-400',
  success: 'bg-green-100 dark:bg-green-400',
  disabled: 'bg-slate-200 dark:bg-slate-800',
};

export const statusBgFillVariants = {
  default: 'bg-slate-700 dark:bg-slate-300',
  info: 'bg-blue-600 dark:bg-blue-500',
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
