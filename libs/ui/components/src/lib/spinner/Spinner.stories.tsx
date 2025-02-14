import { Spinner, SpinnerProps, spinnerVariants } from './Spinner';
import { iconSizes } from '@ui/icons';
import type { Meta, StoryObj } from '@storybook/react';

const variantOptions = Object.keys(spinnerVariants);
const sizeOptions = Object.keys(iconSizes);

const meta = {
  title: 'Atoms/Spinner',
  component: Spinner,
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
  args: {
    size: 'default',
  },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    variant: 'default',
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: 'destructive',
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: 'outline',
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: 'ghost',
  },
} satisfies Story;

export const Link = {
  args: {
    variant: 'link',
  },
} satisfies Story;

type AllSizesComponentProps = {
  variant: SpinnerProps['variant'];
};

const AllSizesComponent: React.FC<AllSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Spinner
        key={size}
        size={size as SpinnerProps['size']}
        variant={variant}
      />
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
