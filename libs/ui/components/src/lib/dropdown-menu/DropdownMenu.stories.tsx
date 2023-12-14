import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { DropdownMenu } from './DropdownMenu';
import { DropdownMenuDemo } from './examples';

const meta = {
  component: DropdownMenu,
  title: 'Molecules/DropdownMenu',
} satisfies Meta<typeof DropdownMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: DropdownMenuDemo,
  args: {},
};

export const OpenedDropdownMenu: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('Open'));

    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
  render: DropdownMenuDemo,
};
