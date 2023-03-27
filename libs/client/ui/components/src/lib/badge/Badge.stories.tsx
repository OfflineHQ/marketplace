import type { Meta, StoryObj } from '@storybook/react';
import { Award } from '@client/ui/icons';

import { Badge, BadgeProps, variants, sizes } from './Badge';

const variantOptions = Object.keys(variants);
const sizeOptions = Object.keys(sizes);

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  render: (args) => <Badge {...args} />,
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
};

export default meta;

type Story = StoryObj<BadgeProps>;

export const DefaultBadge: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'sm',
  },
};

export const IconOnly: Story = {
  args: {
    icon: Award,
  },
};

const AllVariantsComponent: React.FC = () => (
  <>
    {variantOptions.map((variant) => (
      <Badge key={variant} variant={variant as keyof typeof variants}>
        {variant}
      </Badge>
    ))}
  </>
);

export const AllVariants = {
  render: AllVariantsComponent,
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllSizesComponent: React.FC = () => (
  <>
    {sizeOptions.map((size) => (
      <Badge key={size} size={size as keyof typeof sizes}>
        {size}
      </Badge>
    ))}
  </>
);

export const AllSizes = {
  render: AllSizesComponent,
  argTypes: {
    size: {
      control: false,
    },
  },
};

const AllVariantsWithIconComponent: React.FC = () => (
  <>
    {variantOptions.map((variant) => (
      <Badge key={variant} variant={variant as keyof typeof variants} icon={Award}>
        {variant} with Icon
      </Badge>
    ))}
  </>
);

export const AllVariantsWithIcon = {
  render: AllVariantsWithIconComponent,
  argTypes: {
    variant: {
      control: false,
    },
  },
};

const AllSizesWithIconComponent: React.FC = () => (
  <>
    {sizeOptions.map((size) => (
      <Badge key={size} size={size as keyof typeof sizes} icon={Award}>
        {size} with Icon
      </Badge>
    ))}
  </>
);

export const AllSizesWithIcon = {
  render: AllSizesWithIconComponent,
  argTypes: {
    size: {
      control: false,
    },
  },
};
