import { expect } from '@storybook/jest';
// AlertDialog.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { fireEvent, screen, userEvent } from '@storybook/testing-library';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';

import { Button } from '../button/Button';

const meta = {
  title: 'Molecules/AlertDialog',
  component: AlertDialogDemo,
} as Meta<typeof AlertDialogDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

function AlertDialogDemo() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Open</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and
            remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const OpenAlertDialog: Story = {
  play: async () => {
    const alertDialogTrigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(alertDialogTrigger);

    const alertDialogTitle = await screen.findByText('Are you absolutely sure?');
    expect(alertDialogTitle).toBeVisible();

    const alertDialogDescription = await screen.findByText(
      'This action cannot be undone. This will permanently delete your account and remove your data from our servers.'
    );
    expect(alertDialogDescription).toBeVisible();
  },
};

export const CancelAlertDialog: Story = {
  play: async () => {
    const alertDialogTrigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(alertDialogTrigger);

    const alertDialogCancel = screen.getByRole('button', { name: 'Cancel' });
    await fireEvent.click(alertDialogCancel);

    const alertDialogTitle = screen.queryByText('Are you absolutely sure?');
    expect(alertDialogTitle).not.toBeInTheDocument();
  },
};

export const ConfirmAlertDialog: Story = {
  play: async () => {
    const alertDialogTrigger = screen.getByRole('button', { name: 'Open' });
    await userEvent.click(alertDialogTrigger);

    const alertDialogAction = screen.getByRole('button', { name: 'Continue' });
    await fireEvent.click(alertDialogAction);

    // Add any assertions or actions related to the 'Continue' button click
  },
};
