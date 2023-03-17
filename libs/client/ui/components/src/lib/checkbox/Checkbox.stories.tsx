import { expect } from '@storybook/jest';
// Checkbox.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent } from '@storybook/testing-library';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
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
    expect(checkboxElement).toBeDisabled();
    expect(checkboxElement).toHaveAttribute('aria-checked', 'false');
  },
};
