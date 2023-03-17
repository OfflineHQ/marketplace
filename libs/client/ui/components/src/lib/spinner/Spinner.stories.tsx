import { Spinner, SpinnerProps, variants } from './Spinner';
import { iconSizes } from '../icons/variants';
import type { Meta, StoryObj } from '@storybook/react';

const variantOptions = Object.keys(variants);
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
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default = {
  args: {
    variant: 'default',
    size: 'md',
  },
} satisfies Story;

export const Destructive = {
  args: {
    variant: 'destructive',
    size: 'md',
  },
} satisfies Story;

export const Outline = {
  args: {
    variant: 'outline',
    size: 'md',
  },
} satisfies Story;

export const Subtle = {
  args: {
    variant: 'subtle',
    size: 'md',
  },
} satisfies Story;

export const Ghost = {
  args: {
    variant: 'ghost',
    size: 'md',
  },
} satisfies Story;

export const Link = {
  args: {
    variant: 'link',
    size: 'md',
  },
} satisfies Story;

type AllSizesComponentProps = {
  variant: SpinnerProps['variant'];
};

const AllSizesComponent: React.FC<AllSizesComponentProps> = ({ variant }) => (
  <>
    {sizeOptions.map((size) => (
      <Spinner key={size} size={size as SpinnerProps['size']} variant={variant} />
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
