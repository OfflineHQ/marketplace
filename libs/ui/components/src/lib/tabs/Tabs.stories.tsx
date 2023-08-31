// Tabs.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import { screen, userEvent, within } from '@storybook/testing-library';

import { Tabs } from './Tabs';

import { TabsExample, TabsDemo } from './examples';

const meta = {
  title: 'Organisms/Tabs',
  component: Tabs,
  render: TabsExample,
} as Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    const tabs = screen.getByRole('tablist');
    expect(tabs).toBeInTheDocument();
    const firstTab = within(tabs).getByText('Account');
    userEvent.click(firstTab);
    expect(screen.getByText(/Make changes/i)).toBeInTheDocument();
    const secondTab = within(tabs).getByText('Password');
    userEvent.click(secondTab);
    expect(
      await screen.findByText(/Change your password/i)
    ).toBeInTheDocument();
  },
};

export const WithCardAndForm: Story = {
  render: TabsDemo,
};
