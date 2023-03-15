import { AiFillWarning, AiFillCheckCircle, AiFillInfoCircle } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { ComponentType } from 'react';

// Define an interface for the variant classes
interface StatusVariantClass {
  Icon: ComponentType | null;
  color: string;
}

// Define a type for the variant names
type StatusVariantName = 'default' | 'info' | 'failure' | 'warning' | 'success';

// Modify the utility function to specify the return type
function generateStatusVariantClasses(
  icon: ComponentType | null,
  color: string,
  darkColor: string
): StatusVariantClass {
  return {
    Icon: icon,
    color: `${color} dark:${darkColor}`,
  };
}

// Use the type and interface to create the statusVariantIcons object
const statusVariantIcons: Record<StatusVariantName, StatusVariantClass> = {
  default: generateStatusVariantClasses(null, '', ''),
  info: generateStatusVariantClasses(AiFillInfoCircle, 'text-blue-500', 'text-blue-700'),
  failure: generateStatusVariantClasses(MdOutlineError, 'text-red-500', 'text-red-700'),
  warning: generateStatusVariantClasses(
    AiFillWarning,
    'text-yellow-500',
    'text-yellow-700'
  ),
  success: generateStatusVariantClasses(
    AiFillCheckCircle,
    'text-green-500',
    'text-green-700'
  ),
};

const statusBorderVariants = {
  default: 'border-slate-300 dark:border-slate-700',
  info: 'border-blue-500 dark:border-blue-700',
  failure: 'border-red-500 dark:border-red-700',
  warning: 'border-yellow-500 dark:border-yellow-700',
  success: 'border-green-500 dark:border-green-700',
};

export { statusVariantIcons, statusBorderVariants };
