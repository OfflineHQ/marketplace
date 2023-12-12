import type { Meta, StoryObj } from '@storybook/react';
import {
  AspectRatio,
  AspectRatioSkeleton,
  type AspectRatioSkeletonProps,
} from './AspectRatio';

const variantOptions = ['square', 'classic', 'widescreen', 'ultrawide'];

const renderImage = (args: any) => (
  <AspectRatio {...args} className="m-5">
    <img
      className="rounded-sm object-cover"
      src="https://images.unsplash.com/photo-1576075796033-848c2a5f3696?w=800&dpr=2&q=80"
      alt="by Alvaro Pinot"
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '0.375rem',
      }}
    />
  </AspectRatio>
);

const meta = {
  title: 'UI/AspectRatio',
  component: AspectRatio,
  argTypes: {
    variant: {
      options: variantOptions,
      control: { type: 'select' },
    },
  },
  render: renderImage,
} satisfies Meta<typeof AspectRatio>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Square: Story = {
  args: {
    variant: 'square',
  },
};

export const Classic: Story = {
  args: {
    variant: 'classic',
  },
};

export const Widescreen: Story = {
  args: {
    variant: 'widescreen',
  },
};

export const Ultrawide: Story = {
  args: {
    variant: 'ultrawide',
  },
};

export const Loading: Story = {
  render: () => (
    <>
      {variantOptions.map((variant) => (
        <div key={variant} className="mb-2 flex">
          <AspectRatioSkeleton
            variant={variant as AspectRatioSkeletonProps['variant']}
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
