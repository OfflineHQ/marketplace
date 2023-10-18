// Dialog.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import {
  fireEvent,
  screen,
  userEvent,
  within,
} from '@storybook/testing-library';
import { DialogExample, DialogNoHeader, DialogScrollable } from './examples';

import { Dialog } from './Dialog';

const meta = {
  title: 'Organisms/Dialog',
  component: Dialog,
  render: DialogExample,
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenDialogWithFocus: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Edit Profile' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile Dialog');
    expect(dialogTitle).toBeVisible();

    const dialogDescription = await screen.findByText(
      "Make changes to your profile here. Click save when you're done."
    );
    expect(dialogDescription).toBeVisible();
    // Check if the first TextInput is focused
    const dialogContent = screen.getByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    expect(allInputs[0]).toHaveFocus();
  },
};

export const CloseDialog: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Edit Profile' });
    await userEvent.click(dialogTrigger);

    const closeButton = screen.getByTestId('dialog-close');
    await fireEvent.click(closeButton);

    const dialogTitle = screen.queryByText('Edit profile Dialog');
    expect(dialogTitle).not.toBeInTheDocument();
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const DialogWithNoHeader: Story = {
  render: DialogNoHeader,
};

export const OpenedDialogScrollable: Story = {
  render: DialogScrollable,
  play: async () => {
    const dialogTitle = await screen.findByText('Long scrollable text dialog');
    expect(dialogTitle).toBeVisible();

    const dialogDescription = await screen.findByText(
      "Make changes to your profile here. Click save when you're done."
    );
    expect(dialogDescription).toBeVisible();

    const dialogScrollableContent = await screen.findByText('Be optimistic');
    expect(dialogScrollableContent).toBeVisible();

    const footerButton = screen.getByRole('button', {
      name: 'Scroll inside viewport',
    });
    expect(footerButton).toBeVisible();
  },
};
