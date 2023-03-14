import { useState } from 'react';
import { iconCVA } from '@client/ui/shared';

import {
  // Button as FlowbiteButton,
  // ButtonProps as FlowbiteButtonProps,
  // ButtonSizes,
  Spinner,
} from 'flowbite-react';

import * as React from 'react';
import { VariantProps, cva } from 'class-variance-authority';

import { cn } from '@client/ui/shared';

// export const buttonCVA = cva('button', {
//   variants: {
//     intent: {
//       primary: ['bg-blue-500', 'text-white', 'border-transparent', 'hover:bg-blue-600'],
//       secondary: ['bg-white', 'text-gray-800', 'border-gray-400', 'hover:bg-gray-100'],
//     },
//     size: {
//       xs: ['text-xs', 'py-0', 'px-1'],
//       sm: ['text-sm', 'py-1', 'px-2'],
//       md: ['text-base', 'py-2', 'px-4'],
//       lg: ['text-lg', 'py-3', 'px-6'],
//     },
//   },
//   compoundVariants: [{ intent: 'primary', size: 'md', class: 'uppercase' }],
//   defaultVariants: {
//     intent: 'primary',
//     size: 'md',
//   },
// });

// type ExtendedProps = VariantProps<typeof buttonCVA> & {
//   size?: keyof ButtonSizes;
// } & FlowbiteButtonProps;

// export interface ButtonProps extends ExtendedProps {
//   action?: () => void;
//   txt?: string;
//   isLoading?: boolean;
//   icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
//   iconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
// }

// export function Button(props: ButtonProps): JSX.Element {
//   const { children, action, isLoading, size, intent, icon, iconRight, ...rest } = props;

//   const [loading, setLoading] = useState(false);
//   const _loading = isLoading || loading;

//   // TODO maybe use later
//   const button = buttonCVA({ intent, size });

//   // a function that await for the action to be completed
//   const handleClick = async (action: (() => void) | undefined) => {
//     if (action && !_loading) {
//       try {
//         setLoading(true);
//         await action();
//       } finally {
//         setLoading(false);
//       }
//     }
//   };
//   const content = () => {
//     const [LeftIcon, RightIcon] = [icon, iconRight];
//     const _icon = iconCVA({ size });
//     return (
//       <>
//         {_loading ? (
//           <div className="mr-3">
//             <Spinner size="sm" />
//           </div>
//         ) : null}
//         {LeftIcon && !_loading ? <LeftIcon className={`mr-2 ${_icon}`} /> : null}
//         {typeof children !== 'undefined' && children}
//         {RightIcon ? <RightIcon className={`ml-2 ${icon}`} /> : null}
//       </>
//     );
//   };

//   return (
//     <FlowbiteButton onClick={() => handleClick(action)} size={size} {...rest}>
//       {content()}
//     </FlowbiteButton>
//   );
// }

const buttonVariants = cva(
  'active:scale-95 inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-slate-100 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-800',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-50 dark:text-slate-900',
        destructive: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-600',
        outline:
          'bg-transparent border border-slate-200 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100',
        subtle:
          'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100',
        ghost:
          'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-100 dark:hover:text-slate-100 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent',
        link: 'bg-transparent dark:bg-transparent underline-offset-4 hover:underline text-slate-900 dark:text-slate-100 hover:bg-transparent dark:hover:bg-transparent',
      },
      size: {
        default: 'h-10 py-2 px-4',
        sm: 'h-9 px-2 rounded-md',
        lg: 'h-11 px-8 rounded-md',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  action?: () => void;
  isLoading?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, children, action, isLoading, icon, iconRight, ...props },
    ref
  ) => {
    const [loading, setLoading] = useState(false);
    const _loading = isLoading || loading;

    // a function that await for the action to be completed
    const handleClick = async (action: (() => void) | undefined) => {
      if (action && !_loading) {
        try {
          setLoading(true);
          await action();
        } finally {
          setLoading(false);
        }
      }
    };
    const content = () => {
      const [LeftIcon, RightIcon] = [icon, iconRight];
      const _icon = iconCVA({ size });
      return (
        <>
          {_loading ? (
            <div className="mr-3">
              <Spinner size="sm" />
            </div>
          ) : null}
          {LeftIcon && !_loading ? <LeftIcon className={`mr-2 ${_icon}`} /> : null}
          {typeof children !== 'undefined' && children}
          {RightIcon ? <RightIcon className={`ml-2 ${icon}`} /> : null}
        </>
      );
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        onClick={() => (_loading ? handleClick(action) : null)}
      >
        {content()}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
