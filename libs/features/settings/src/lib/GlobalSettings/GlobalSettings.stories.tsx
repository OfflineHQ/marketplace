// GlobalSettings.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { GlobalSettings } from './GlobalSettings';
import { GlobalSettingsExample, globalSettingsProps } from './examples';

const meta = {
  component: GlobalSettings,
  args: globalSettingsProps,
  render: GlobalSettingsExample,
} satisfies Meta<typeof GlobalSettings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
