import { expect } from '@storybook/jest';
import {
  fireEvent,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from './Toaster';
import { ToastAction } from './Toast';
import { ToastSimple, type ToasterToast } from './examples';
import { sleep } from '@utils';

const meta: Meta<ToasterToast> = {
  render: (args) => {
    return (
      <>
        <ToastSimple {...args} />
        <Toaster />
      </>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
  title: 'Molecules/Toast',
};

export default meta;

type Story = StoryObj<typeof meta>;

export const TextClose: Story = {
  args: {
    description: 'The toast is closable',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });
    await userEvent.click(toasterTrigger);
    const closeButton = screen.getByTestId('toast-close');
    await fireEvent.click(closeButton);
    await waitForElementToBeRemoved(() =>
      screen.queryByText('The toast is closable')
    );
  },
};

export const SimpleToast: Story = {
  args: {
    description: 'This is a toast',
  },
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });
    await userEvent.click(toasterTrigger);
    const toastDescription = await screen.findByText('This is a toast');
    expect(toastDescription).toBeVisible();
  },
};

export const ThreeToast: Story = {
  ...SimpleToast,
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });

    // Click the button 3 times
    await userEvent.click(toasterTrigger);
    await sleep(100);
    await userEvent.click(toasterTrigger);
    await sleep(100);
    await userEvent.click(toasterTrigger);
    await sleep(100);

    // Wait for all 3 toasts to be visible
    const toastDescriptions = await screen.findAllByText('This is a toast');

    // Check if there are exactly 3 toasts
    expect(toastDescriptions.length).toEqual(3);

    // Check if all 3 toasts are visible
    toastDescriptions.forEach((toastDescription) => {
      expect(toastDescription).toBeVisible();
    });
  },
};

export const ToastWithTitleAndDescription: Story = {
  args: {
    title: 'New message received',
    description: 'You have received a new message from John Doe.',
  },
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });
    await userEvent.click(toasterTrigger);
    const toastTitle = await screen.findByText('New message received');
    expect(toastTitle).toBeVisible();

    const toastDescription = await screen.findByText(
      'You have received a new message from John Doe.'
    );
    expect(toastDescription).toBeVisible();
  },
};

export const ToastWithAction: Story = {
  args: {
    title: 'This is a toast with action',
    description: 'And a description',
    action: <ToastAction altText="Try again">Try again</ToastAction>,
  },
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });
    await userEvent.click(toasterTrigger);
    const toastTitle = await screen.findByText('This is a toast with action');
    expect(toastTitle).toBeVisible();

    const toastDescription = await screen.findByText('And a description');
    expect(toastDescription).toBeVisible();

    const toastAction = screen.getByRole('button', { name: 'Try again' });
    expect(toastAction).toBeVisible();
  },
};

export const ToastWithDestructiveVariant: Story = {
  args: {
    ...ToastWithAction.args,
    variant: 'destructive',
    title: 'Uh oh! Something went wrong.',
    description: 'There was a problem with your request.',
  },
  play: async () => {
    const toasterTrigger = screen.getByRole('button', { name: 'Show Toast' });
    await userEvent.click(toasterTrigger);
    const toastTitle = await screen.findByText('Uh oh! Something went wrong.');
    expect(toastTitle).toBeVisible();
    const toastElement = screen.getByRole('alert');
    expect(toastElement).toHaveClass('destructive');
  },
};
