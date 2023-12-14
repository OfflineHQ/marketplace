// Checkbox.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen } from '@storybook/test';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checked: Story = {
  play: async () => {
    const checkboxElement = screen.getByRole('checkbox');
    // Toggle checkbox on
    fireEvent.click(checkboxElement);
    await screen.findByRole('checkbox', { checked: true });
  },
};

export const Unchecked: Story = {
  play: async () => {
    const checkboxElement = screen.getByRole('checkbox');

    // Toggle checkbox on
    fireEvent.click(checkboxElement);
    await screen.findByRole('checkbox', { checked: true });

    // Toggle checkbox off
    fireEvent.click(checkboxElement);
    await screen.findByRole('checkbox', { checked: false });
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async () => {
    const checkboxElement = screen.getByRole('checkbox');
    await expect(checkboxElement).toBeDisabled();
    await expect(checkboxElement).toHaveAttribute('aria-checked', 'false');
  },
};

export const CheckedDisabled: Story = {
  args: {
    checked: true,
    disabled: true,
  },
};
