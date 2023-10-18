// Sheet.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import {
  fireEvent,
  screen,
  userEvent,
  within,
} from '@storybook/testing-library';

import { Sheet, SheetContentProps } from './Sheet';

import { SheetDemo, SheetSkeletonDemo } from './examples';

const meta = {
  title: 'Organisms/Sheet',
  component: Sheet,
  render: SheetDemo,
  argTypes: {
    size: {
      control: 'select',
      options: ['default', 'lg', 'content', 'full'],
    },
    position: {
      control: 'select',
      options: ['top', 'right', 'bottom', 'left'],
    },
  },
  args: {
    size: 'default',
    position: 'right',
  },
} as Meta<SheetContentProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenedSheetWithFocus: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();

    const dialogDescription = await screen.findByText(
      "Make changes to your profile here. Click save when you're done.",
    );
    expect(dialogDescription).toBeVisible();
    // Check if the first TextInput is focused
    const dialogContent = screen.getByRole('dialog');
    const allInputs = within(dialogContent).getAllByRole('textbox');
    expect(allInputs[0]).toHaveFocus();
    // check if scroll work as expected, Button "Save change" should be visible
    const saveButton = screen.getByRole('button', { name: 'Save changes' });
    expect(saveButton).toBeVisible();
  },
};

export const CloseSheet: Story = {
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const closeButton = screen.getByTestId('sheet-close');
    await fireEvent.click(closeButton);

    const dialogTitle = screen.queryByText('Edit profile');
    expect(dialogTitle).not.toBeInTheDocument();
  },
};

export const Large: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    size: 'lg',
  },
};

export const Full: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
    const backButton = screen.getByTestId('sheet-back');
    expect(backButton).toBeVisible();
  },
  args: {
    size: 'full',
  },
};

export const FullWithBackButton: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();

    // Button is wrapped inside SheetPrimitive.Close Button
    const backButtonTxt = await screen.getByRole('button', {
      name: /Go back/i,
    });
    expect(backButtonTxt).toBeVisible();
  },
  args: {
    size: 'full',
    backButtonText: 'Go back',
  },
};

export const Content: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    size: 'content',
  },
};

export const Top: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'top',
  },
};

export const Left: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'left',
  },
};

export const Bottom: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'bottom',
  },
};

export const Right: Story = {
  play: async () => {
    const dialogTrigger = screen.getByRole('button', { name: 'Open sheet' });
    await userEvent.click(dialogTrigger);

    const dialogTitle = await screen.findByText('Edit profile');
    expect(dialogTitle).toBeVisible();
  },
  args: {
    position: 'right',
  },
};

export const Loading: Story = {
  render: (props) => <SheetSkeletonDemo {...props} />,
};

export const LoadingWithGoBackButton: Story = {
  ...Loading,
  args: {
    backButtonText: 'Go back',
    size: 'full',
  },
};
