// GlobalSettings.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { GlobalSettings } from './GlobalSettings';
import { globalSettingsProps, GlobalSettingsExample } from './examples';

const meta = {
  component: GlobalSettings,
  args: globalSettingsProps,
  render: GlobalSettingsExample,
} satisfies Meta<typeof GlobalSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
