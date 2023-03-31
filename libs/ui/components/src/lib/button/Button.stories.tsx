import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { OutlineArrowRight, Settings } from '@ui/icons';
import { delayData } from '@test-utils/functions';

import { Button, buttonVariants, buttonSizes } from './Button';

const variantOptions = Object.keys(buttonVariants);
const sizeOptions = Object.keys(buttonSizes);

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

type AllbuttonVariantsComponentProps = {
  size: keyof typeof buttonSizes;
};

const AllbuttonVariantsComponent: React.FC<AllbuttonVariantsComponentProps> = ({
  size,
}) => (
  <>
    {variantOptions.map((variant) => (
      <Button key={variant} size={size} variant={variant as keyof typeof buttonVariants}>
        {variant}
      </Button>
    ))}
  </>
);

export const AllbuttonVariants = {
  render: AllbuttonVariantsComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

type AllbuttonSizesComponentProps = {
  variant: keyof typeof buttonVariants;
};

const AllbuttonSizesComponent: React.FC<AllbuttonSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Button key={size} size={size as keyof typeof buttonSizes} variant={variant}>
        {size}
      </Button>
    ))}
  </>
);

export const AllbuttonSizes = {
  render: AllbuttonSizesComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllbuttonVariantsLoadingComponent: React.FC<AllbuttonVariantsComponentProps> = ({
  size,
}) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {variant} Loading
      </Button>
    ))}
  </>
);

export const AllbuttonVariantsLoading = {
  render: AllbuttonVariantsLoadingComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllbuttonSizesLoadingComponent: React.FC<AllbuttonSizesComponentProps> = ({
  variant,
}) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        onClick={() => delayData(3000, null)}
        isLoading
      >
        {size} Loading
      </Button>
    ))}
  </>
);

export const AllbuttonSizesLoading = {
  render: AllbuttonSizesLoadingComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllbuttonVariantsDisabledComponent: React.FC<AllbuttonVariantsComponentProps> = ({
  size,
}) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        disabled
      >
        {variant} Disabled
      </Button>
    ))}
  </>
);

export const AllbuttonVariantsDisabled = {
  render: AllbuttonVariantsDisabledComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllbuttonVariantsWithIconComponent: React.FC<AllbuttonVariantsComponentProps> = ({
  size,
}) => (
  <>
    {variantOptions.map((variant) => (
      <Button
        key={variant}
        size={size}
        variant={variant as keyof typeof buttonVariants}
        icon={OutlineArrowRight}
      >
        {variant} with Icon
      </Button>
    ))}
  </>
);

export const AllbuttonVariantsWithIcon = {
  render: AllbuttonVariantsWithIconComponent,
  args: {
    size: 'md',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllbuttonSizesWithIconComponent: React.FC<AllbuttonSizesComponentProps> = ({
  variant,
}) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        icon={OutlineArrowRight}
      >
        {size} with Icon
      </Button>
    ))}
  </>
);

export const AllbuttonSizesWithIcon = {
  render: AllbuttonSizesWithIconComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllbuttonSizesWithIconRightComponent: React.FC<AllbuttonSizesComponentProps> = ({
  variant,
}) => (
  <>
    {sizeOptions.map((size) => (
      <Button
        key={size}
        size={size as keyof typeof buttonSizes}
        variant={variant}
        iconRight={OutlineArrowRight}
      >
        {size} with Icon Right
      </Button>
    ))}
  </>
);

export const AllbuttonSizesWithIconRight = {
  render: AllbuttonSizesWithIconRightComponent,
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};
