// TextInput.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { OutlineSearch } from '../icons';
import { TextInput, TextInputProps } from './TextInput';
import { TextInputWithLeftLabels } from './examples';
import { sizes, variants } from '../input/Input';

const variantOptions = Object.keys(variants);
const sizeOptions = Object.keys(sizes);

const meta = {
  title: 'Molecules/TextInput',
  component: TextInput,
  argTypes: {
    size: {
      options: sizeOptions,
      control: { type: 'select' },
    },
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
    helperText: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Label',
    htmlFor: 'input-id',
    placeholder: 'Enter text...',
  },
};

export const WithIcon: Story = {
  args: {
    ...Default.args,
    icon: OutlineSearch,
  },
};

export const WithRightIcon: Story = {
  args: {
    ...Default.args,
    rightIcon: OutlineSearch,
  },
};

export const WithHelperText: Story = {
  args: {
    ...Default.args,
    helperText: 'Helper text',
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const AllSizes: Story = {
  render: ({ variant }) => (
    <>
      {sizeOptions.map((size) => (
        <div key={size} className="mb-2">
          <TextInput
            {...Default.args}
            size={size as keyof typeof sizes}
            label={`${size} Size`}
            variant={variant}
            htmlFor={`input-id-${size}`}
          />
        </div>
      ))}
    </>
  ),
  args: {
    variant: 'default',
    label: 'Label',
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
          <TextInput
            {...Default.args}
            size={size}
            variant={variant as keyof typeof variants}
            label={`${variant} Variant`}
            htmlFor={`input-id-${variant}`}
          />
        </div>
      ))}
    </>
  ),
  args: {
    variant: 'default',
    label: 'Label',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const AllVariantsWithHelperText: Story = {
  render: ({ size }) => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2">
          <TextInput
            {...WithHelperText.args}
            size={size}
            variant={variant as keyof typeof variants}
            label={`${variant} Variant`}
            htmlFor={`input-id-${variant}`}
          />
        </div>
      ))}
    </>
  ),
  args: {
    variant: 'default',
    label: 'Label',
  },
  argTypes: {
    variant: {
      control: false,
    },
  },
};

export const WithLeftLabels: Story = {
  render: (props) => <TextInputWithLeftLabels {...props} className="sm:w-80" />,
  args: {
    leftLabel: true,
    size: 'sm',
    label: '',
  },
  argTypes: {
    leftLabel: {
      control: false,
    },
  },
};
