import { useState } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva } from 'class-variance-authority';
import { iconCVA } from '@client/ui/shared';

import {
  Button as FlowbiteButton,
  ButtonProps as FlowbiteButtonProps,
  ButtonSizes,
  Spinner,
} from 'flowbite-react';

export const buttonCVA = cva('button', {
  variants: {
    intent: {
      primary: ['bg-blue-500', 'text-white', 'border-transparent', 'hover:bg-blue-600'],
      secondary: ['bg-white', 'text-gray-800', 'border-gray-400', 'hover:bg-gray-100'],
    },
    size: {
      xs: ['text-xs', 'py-0', 'px-1'],
      sm: ['text-sm', 'py-1', 'px-2'],
      md: ['text-base', 'py-2', 'px-4'],
      lg: ['text-lg', 'py-3', 'px-6'],
    },
  },
  compoundVariants: [{ intent: 'primary', size: 'md', class: 'uppercase' }],
  defaultVariants: {
    intent: 'primary',
    size: 'md',
  },
});

type ExtendedProps = VariantProps<typeof buttonCVA> & {
  size?: keyof ButtonSizes;
} & FlowbiteButtonProps;

interface ButtonProps extends ExtendedProps {
  action?: () => void;
  txt?: string;
  isLoading?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function Button(props: ButtonProps): JSX.Element {
  const { children, action, isLoading, size, intent, icon, iconRight, ...rest } = props;

  const [loading, setLoading] = useState(false);
  const _loading = isLoading || loading;

  // TODO maybe use later
  const button = buttonCVA({ intent, size });

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
    <FlowbiteButton onClick={() => handleClick(action)} size={size} {...rest}>
      {content()}
    </FlowbiteButton>
  );
}
