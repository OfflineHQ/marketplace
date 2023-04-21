// Text.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Text, TextProps, TextLoader, TextLoaderProps, textVariants } from './Text';

const variantOptions = Object.keys(textVariants);

const meta = {
  title: 'Atoms/Text',
  component: Text,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultText: Story = {
  render: ({ children, variant }) => <Text variant={variant}>{children}</Text>,
  args: {
    children: 'Default Text',
  },
};

export const AllVariants: Story = {
  render: () => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2">
          <Text variant={variant as TextProps['variant']}>{`${variant} Text`}</Text>
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

export const LoaderAllVariants: Story = {
  render: () => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2 flex">
          <TextLoader variant={variant as TextLoaderProps['variant']} />
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
