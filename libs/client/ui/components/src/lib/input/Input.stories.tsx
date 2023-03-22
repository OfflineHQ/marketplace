import type { Meta, StoryObj } from '@storybook/react';
import { OutlineSearch } from '../icons';

import { Input, InputProps, inputBorderVariants, inputSizes } from './Input';

const variantOptions = Object.keys(inputBorderVariants);
const sizeOptions = Object.keys(inputSizes);

const meta = {
  title: 'Atoms/Input',
  component: Input,
  argTypes: {
    size: {
      options: sizeOptions,
      control: { type: 'select' },
    },
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultInput: Story = {
  args: {
    placeholder: 'Default Input',
  },
};

export const InputWithIcon: Story = {
  args: {
    placeholder: 'Input with Icon',
    icon: OutlineSearch,
  },
};

export const InputWithRightIcon: Story = {
  args: {
    placeholder: 'Input with Right Icon',
    rightIcon: OutlineSearch,
  },
};

export const AllSizes: Story = {
  render: ({ variant }) => (
    <>
      {sizeOptions.map((size) => (
        <div key={size} className="mb-2">
          <Input
            size={size as InputProps['size']}
            variant={variant}
            placeholder={`${size} Input`}
          />
        </div>
      ))}
    </>
  ),
  args: {
    variant: 'default',
  },
  argTypes: {
    size: {
      control: false,
    },
  },
};

export const AllVariants: Story = {
  render: ({ size }) => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2">
          <Input
            size={size}
            variant={variant as InputProps['variant']}
            placeholder={`${variant} Input`}
          />
        </div>
      ))}
    </>
  ),
  argTypes: {
    variant: {
      control: false,
    },
  },
};
