import { Meta, StoryObj } from '@storybook/react';
import { fireEvent, screen, userEvent } from '@storybook/test';
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

export const DropdownMenuItemsWithRadios: Story = {
  args: {
    items: [
      {
        type: 'sub-radios',
        text: 'Labels',
        value: '1',
        subItems: [
          {
            text: 'Radio 1',
            type: 'item',
            value: '1',
          },
          {
            text: 'Radio 2',
            type: 'item',
            value: '2',
          },
          {
            text: 'Radio 3',
            type: 'item',
            value: '3',
          },
        ],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByText('Open'));
    const labelsElement = await screen.findByText(/Labels/i);
    fireEvent.pointerOver(labelsElement);
    fireEvent.click(labelsElement);
    await screen.findByText(/Radio 1/i);
  },
};
