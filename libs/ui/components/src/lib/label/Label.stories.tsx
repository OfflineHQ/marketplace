// Label.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import { Label, LabelProps, labelVariants } from './Label';

const variantOptions = Object.keys(labelVariants);

const meta = {
  title: 'Atoms/Label',
  component: Label,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultLabel: Story = {
  args: {
    children: 'Default Label',
  },
};

export const AllVariants: Story = {
  render: () => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2">
          <Label variant={variant as LabelProps['variant']}>{`${variant} Label`}</Label>
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
