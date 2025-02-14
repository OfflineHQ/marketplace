import type { Meta, StoryObj } from '@storybook/react';
import { Award } from '@ui/icons';

import {
  Badge,
  BadgeProps,
  BadgeSkeleton,
  type BadgeSkeletonProps,
  badgeVariants,
  badgeSizes,
} from './Badge';

const variantOptions = Object.keys(badgeVariants);
const sizeOptions = Object.keys(badgeSizes);

const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
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
    icon: <Award />,
  },
};

const AllVariantsComponent: React.FC = () => (
  <>
    {variantOptions.map((variant) => (
      <Badge
        key={variant}
        variant={variant as keyof typeof badgeVariants}
        className="mb-2"
      >
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
      <Badge key={size} size={size as keyof typeof badgeSizes} className="mb-2">
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
      <Badge
        key={variant}
        variant={variant as keyof typeof badgeVariants}
        icon={<Award />}
        className="mb-2"
      >
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
      <Badge
        key={size}
        size={size as keyof typeof badgeSizes}
        icon={<Award />}
        className="mb-2"
      >
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

const AllSkeletonSizesComponent: React.FC = () => (
  <>
    {sizeOptions.map((size) => (
      <BadgeSkeleton
        key={size}
        size={size as keyof typeof badgeSizes}
        className="mb-2"
      />
    ))}
  </>
);

export const AllSkeletonSizes = {
  render: AllSkeletonSizesComponent,
  argTypes: {
    size: {
      control: false,
    },
  },
};
