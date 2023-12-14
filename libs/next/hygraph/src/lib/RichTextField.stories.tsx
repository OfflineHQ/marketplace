import type { Meta, StoryObj } from '@storybook/react';

import { RichTextField, RichTextFieldSkeleton } from './RichTextField';
import {
  rtfProps,
  rtfWithAllKindsOfTextProps,
  rtfWithImageProps,
  rtfWithLinkProps,
} from './examples';

// Import the stories you want to reuse

const meta: Meta<typeof RichTextField> = {
  component: RichTextField,
  args: rtfProps,
  title: 'Hygraph/RichTextField',
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof RichTextField>;

export const Default: Story = {};

export const WithImage: Story = {
  args: rtfWithImageProps,
};

export const WithLink: Story = {
  args: rtfWithLinkProps,
};

export const WithAllKindsOfText: Story = {
  args: rtfWithAllKindsOfTextProps,
};

export const Skeleton: Story = {
  render: () => <RichTextFieldSkeleton />,
};
