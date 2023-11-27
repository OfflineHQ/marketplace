import type { Meta, StoryObj } from '@storybook/react';

import { HelperText, HelperTextProps, helperTextVariants } from './HelperText';

const variantOptions = Object.keys(helperTextVariants);

const meta = {
  title: 'Atoms/HelperText',
  component: HelperText,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof HelperText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultHelperText: Story = {
  args: {
    children: 'Default Helper Text',
  },
};

export const AllVariants: Story = {
  render: () => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2">
          <HelperText variant={variant as HelperTextProps['variant']}>
            {`${variant} Helper Text`}
          </HelperText>
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

export const WithMessage: Story = {
  args: {
    message: 'This is a message',
  },
};

export const WithSeveralMessages: Story = {
  args: {
    message: ['This is a message', 'This is another message'],
  },
};
