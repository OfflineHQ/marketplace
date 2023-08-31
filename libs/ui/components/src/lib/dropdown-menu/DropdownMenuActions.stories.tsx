import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
} from '@storybook/testing-library';
import { DropdownMenuActions } from './DropdownMenuActions';
import { menuItems } from './examples';

const meta = {
  component: DropdownMenuActions,
  title: 'Molecules/DropdownMenuActions',
  render: (props) => <DropdownMenuActions {...props} />,
  args: {
    items: menuItems,
    helperText: 'This is a helper text',
  },
} satisfies Meta<typeof DropdownMenuActions>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenedWithHelperText: Story = {
  play: async ({ canvasElement }) => {
    const buttonElement = screen.getByRole('button');
    userEvent.hover(buttonElement);
    expect(await screen.findAllByText(/helper text/i)).toBeTruthy();
    userEvent.click(buttonElement);
    screen.findByText('My Account');
  },
};
export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
