import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, within } from '@storybook/test';
import { Popover } from './Popover';

import { PopoverDemo, PopoverDemoWithNoHeader } from './examples';

const meta = {
  component: Popover,
  title: 'Molecules/Popover',
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenPopoverWithFocus: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));

    await screen.findByText('Dimensions');
    const dialogContent = screen.getByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    await expect(allInputs[0]).toHaveFocus();
  },
  render: PopoverDemo,
};

export const OpenPopoverAndClose: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));

    await screen.findByText('Dimensions');
    const closeButton = screen.getByTestId('popover-close');
    await fireEvent.click(closeButton);
    const dialogTitle = screen.queryByText('Dimensions');
    expect(dialogTitle).not.toBeInTheDocument();
  },
  render: PopoverDemo,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const OpenPopoverWithNoHeader: Story = {
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));
    const dialogContent = await screen.findByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    await expect(allInputs[0]).toHaveFocus();
  },
  render: PopoverDemoWithNoHeader,
};
