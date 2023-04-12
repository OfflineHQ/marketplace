import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { DropdownMenuItems } from './DropdownMenuItems';
import { DropdownMenuItemsDemo, menuItems } from './examples';

const meta = {
  component: DropdownMenuItems,
  title: 'Molecules/DropdownMenuItems',
  render: DropdownMenuItemsDemo,
  args: {
    items: menuItems,
  },
} satisfies Meta<typeof DropdownMenuItems>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenedDropdownMenuItems: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('Open'));

    await screen.findByText('My Account');
    await screen.findByText('Log out');
  },
};
