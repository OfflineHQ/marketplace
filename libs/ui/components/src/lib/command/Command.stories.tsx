import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import {
  fireEvent,
  screen,
  userEvent,
  within,
  waitFor,
} from '@storybook/testing-library';
import { Command } from './Command';

import {
  CommandDemo,
  CommandDialogDemo,
  CommandComboboxDemo,
  CommandPopoverDemo,
  CommandDropdownMenuDemo,
} from './examples';
import { sleep } from '@utils';

const meta: Meta<typeof Command> = {
  component: Command,
  title: 'Organisms/Command',
};
export default meta;

type Story = StoryObj<typeof meta>;

export const BasicCommand: Story = {
  render: CommandDemo,
};

export const BasicCommandWithText: Story = {
  ...BasicCommand,
  play: async () => {
    await userEvent.type(
      screen.getByPlaceholderText('Type a command or search...'),
      'Ca'
    );
    const roleGroup = screen.getByRole('group');
    expect(roleGroup.children.length).toBe(2);
  },
};

export const BasicCommandWithNoResult: Story = {
  ...BasicCommand,
  play: async () => {
    await userEvent.type(
      screen.getByPlaceholderText('Type a command or search...'),
      'XYZ'
    );
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByText('No results found.')).toBeVisible();
  },
};

export const CommandDialog: Story = {
  render: CommandDialogDemo,
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};

export const CommandCombobox: Story = {
  render: CommandComboboxDemo,
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('combobox'));
    // check that Next.js item with aria-selected="true"
    expect(await screen.findByText('Next.js')).toHaveAttribute(
      'aria-selected',
      'true'
    );
  },
};

export const CommandComboboxWithText: Story = {
  ...CommandCombobox,
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('combobox'));
    const Input = await screen.findByTestId('command-input');
    await userEvent.type(Input, 'Re');
    const roleGroup = screen.getByRole('group');
    expect(roleGroup.children.length).toBe(1);
  },
};

export const CommandComboboxWithSelection: Story = {
  ...CommandCombobox,
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('combobox'));
    const Input = await screen.findByTestId('command-input');
    await userEvent.type(Input, 'Re');
    userEvent.keyboard('{enter}');
    await screen.findByText('Remix');
    await sleep(100);
    userEvent.click(screen.getByRole('combobox'));
    // find in role group the selected item Remix
    const roleGroup = await screen.findByRole('group');
    const { getByText } = within(roleGroup);
    expect(getByText('Remix')).toHaveAttribute('data-state', 'checked');
  },
};

export const CommandPopover: Story = {
  render: CommandPopoverDemo,
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));
    await screen.findByText('Backlog');
  },
};

export const CommandDropdownMenu: Story = {
  render: CommandDropdownMenuDemo,
  play: async ({ canvasElement }) => {
    userEvent.click(screen.getByRole('button'));
    const menuItem = await screen.findByRole('menuitem', {
      name: /Apply label/i,
    });
    fireEvent.click(menuItem);
    await screen.findByText('bug');
  },
};
