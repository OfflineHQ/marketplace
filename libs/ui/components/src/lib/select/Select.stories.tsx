import { expect } from '@storybook/jest';
// Select.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';
import { SelectDemo } from './examples';

import { Select } from './Select';

const meta = {
  title: 'Molecules/Select',
  component: Select,
  render: SelectDemo,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SelectedItem: Story = {
  play: async () => {
    await userEvent.click(screen.getByRole('combobox'));
    const optionList = await screen.findByRole('listbox');
    const appleItem = within(optionList).getByRole('option', {
      name: 'Banana',
    });
    await userEvent.dblClick(appleItem);
    const selectedItem = screen.getByRole('combobox');
    expect(selectedItem.textContent).toBe('Banana');
    await userEvent.click(screen.getByRole('combobox'));

    // Find the checked item using the data-state attribute with the value 'checked'
    const checkedItem = screen.getByRole('option', { name: 'Banana' });

    // Check if the checked item's data-state attribute is "checked"
    expect(checkedItem.getAttribute('data-state')).toBe('checked');
  },
};
