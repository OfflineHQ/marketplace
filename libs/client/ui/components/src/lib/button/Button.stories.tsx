import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { OutlineArrowRight, Settings } from '@client/ui/icons';
import { delayData } from '@test-utils/functions';

import { Button, variants, sizes } from './Button';

const variantOptions = Object.keys(variants);
const sizeOptions = Object.keys(sizes);

const meta = {
  title: 'Atoms/Button',
  component: Button,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'radio' },
    },
    size: {
      options: sizeOptions,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultButton = {
  args: {
    children: 'Button with Click and Loading',
    onClick: () => delayData(1000, null),
  },
  play: async ({ canvasElement, controls }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button'));
    // Check that the spinner is present
    expect(screen.queryByRole('status')).toBeInTheDocument();
  },
} satisfies Story;

export const ButtonWithOnlyIcon = {
  args: {
    children: undefined,
    icon: Settings,
  },
} satisfies Story;

type AllVariantsComponentProps = {
  size: keyof typeof sizes;
};

const AllVariantsComponent: React.FC<AllVariantsComponentProps> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <Button key={variant} size={size} variant={variant as keyof typeof variants}>
        {variant}
      </Button>
    ))}
  </>
);

export const AllVariants = {
  render: AllVariantsComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

type AllSizesComponentProps = {
  variant: keyof typeof variants;
};

const AllSizesComponent: React.FC<AllSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Button key={size} size={size as keyof typeof sizes} variant={variant}>
        {size}
      </Button>
    ))}
  </>
);

export const AllSizes = {
  render: AllSizesComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllVariantsLoadingComponent: React.FC<AllVariantsComponentProps> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof variants}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {variant} Loading
      </Button>
    ))}
  </>
);

export const AllVariantsLoading = {
  render: AllVariantsLoadingComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllSizesLoadingComponent: React.FC<AllSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof sizes}
        variant={variant}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {size} Loading
      </Button>
    ))}
  </>
);

export const AllSizesLoading = {
  render: AllSizesLoadingComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllVariantsDisabledComponent: React.FC<AllVariantsComponentProps> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof variants}
        disabled
      >
        {variant} Disabled
      </Button>
    ))}
  </>
);

export const AllVariantsDisabled = {
  render: AllVariantsDisabledComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllVariantsWithIconComponent: React.FC<AllVariantsComponentProps> = ({ size }) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof variants}
        icon={OutlineArrowRight}
      >
        {variant} with Icon
      </Button>
    ))}
  </>
);

export const AllVariantsWithIcon = {
  render: AllVariantsWithIconComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllSizesWithIconComponent: React.FC<AllSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof sizes}
        variant={variant}
        icon={OutlineArrowRight}
      >
        {size} with Icon
      </Button>
    ))}
  </>
);

export const AllSizesWithIcon = {
  render: AllSizesWithIconComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllSizesWithIconRightComponent: React.FC<AllSizesComponentProps> = ({
  variant,
}) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof sizes}
        variant={variant}
        iconRight={OutlineArrowRight}
      >
        {size} with Icon Right
      </Button>
    ))}
  </>
);

export const AllSizesWithIconRight = {
  render: AllSizesWithIconRightComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};
