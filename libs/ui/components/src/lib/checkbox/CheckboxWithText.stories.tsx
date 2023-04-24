import { expect } from '@storybook/jest';
// CheckboxWithText.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent } from '@storybook/testing-library';
import { CheckboxWithText } from './CheckboxWithText';

const meta = {
  title: 'Atoms/CheckboxWithText',
  component: CheckboxWithText,
  args: {
    label: 'Checkbox label',
  },
  argTypes: {
    label: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
  },
} satisfies Meta<typeof CheckboxWithText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async () => {
    const checkboxElement = screen.getByRole('checkbox');
    const labelElement = screen.getByText('Checkbox label');

    // Toggle checkbox on
    fireEvent.click(labelElement);
    await screen.findByRole('checkbox', { checked: true });

    // Toggle checkbox off
    fireEvent.click(labelElement);
    await screen.findByRole('checkbox', { checked: false });
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
  play: async () => {
    const checkboxElement = screen.getByRole('checkbox');
    const labelElement = screen.getByText('Checkbox label');

    expect(checkboxElement).toBeDisabled();
    expect(checkboxElement).toHaveAttribute('aria-checked', 'false');

    // Ensure the label doesn't toggle the checkbox when disabled
    fireEvent.click(labelElement);
    await screen.findByRole('checkbox', { checked: false });
  },
};

export const WithHelperText: Story = {
  args: {
    helperText: 'This is a helper text',
  },
};

export const WithHelperTextAndDisabled: Story = {
  args: { ...WithHelperText.args, disabled: true },
};
