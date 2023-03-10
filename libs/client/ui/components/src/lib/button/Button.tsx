import { useState } from 'react';
import { useMemo } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { cva, cx } from 'class-variance-authority';

import {
  Button as FlowbiteButton,
  ButtonProps as FlowbiteButtonProps,
  ButtonSizes,
  Spinner,
} from 'flowbite-react';

interface ButtonProps extends FlowbiteButtonProps {
  action?: () => void;
  txt?: string;
  isLoading?: boolean;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  iconRight?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// export interface ButtonProps
//   extends FlowbiteButtonProps,
//     Omit<ButtonVariantProps, 'required'>,
//     Required<Pick<ButtonVariantProps, 'required'>> {}

// export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
// export const buttonVariants = cva('…', {
//   variants: {
//     optional: {  },
//     required: { a: '…', b: '…' },
//   },
// });

const getSizeClasses = (size: keyof ButtonSizes | undefined) => {
  switch (size) {
    case 'sm': {
      return 'px-4 py-2.5';
    }
    case 'lg': {
      return 'px-6 py-3';
    }
    default: {
      return 'px-5 py-2.5';
    }
  }
};

// const getModeClasses = (isPrimary: boolean) =>
//   isPrimary
//     ? 'text-white bg-pink-600 border-pink-600 dark:bg-pink-700 dark:border-pink-700'
//     : 'text-slate-700 bg-transparent border-slate-700 dark:text-white dark:border-white';

// const BASE_BUTTON_CLASSES =
//   'cursor-pointer rounded-full border-2 font-bold leading-none inline-block';

export function Button(props: ButtonProps): JSX.Element {
  const { action, isLoading, size, ...rest } = props;

  const [loading, setLoading] = useState(false);

  const computedClasses = useMemo(() => {
    // const modeClass = getModeClasses(primary);
    // return [modeClass, sizeClass].join(' ');
    return getSizeClasses(size);
  }, [size]);

  // a function that await for the action to be completed
  const handleClick = async (action: (() => void) | undefined) => {
    if (action) {
      try {
        console.log('loading');
        setLoading(true);
        await action();
      } finally {
        console.log('not loading');
        setLoading(false);
      }
    }
  };
  const content = () => {
    const [LeftIcon, RightIcon] = [props.icon, props.iconRight];
    const _loading = isLoading || loading;
    return (
      <>
        {_loading ? (
          <div className="mr-3">
            <Spinner size={size} />{' '}
          </div>
        ) : null}
        {LeftIcon ? <LeftIcon className="mr-2 h-6 w-6" /> : null}
        {props.txt || null}
        {RightIcon ? <RightIcon className="ml-2 h-6 w-6" /> : null}
      </>
    );
  };

  return (
    <FlowbiteButton onClick={() => handleClick(action)} size={size} {...rest}>
      {content()}
    </FlowbiteButton>
  );
}
