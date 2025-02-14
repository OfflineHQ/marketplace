// GlobalSettings.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Settings } from './Settings';
import { SettingsExample } from './examples';

const meta = {
  component: Settings,
  render: SettingsExample,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Settings>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
