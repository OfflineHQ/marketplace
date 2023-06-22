import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { RichTextField, RichTextFieldSkeleton } from './RichTextField';
import {
  rtfProps,
  rtfWithImageProps,
  rtfWithLinkProps,
  rtfWithAllKindsOfTextProps,
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
