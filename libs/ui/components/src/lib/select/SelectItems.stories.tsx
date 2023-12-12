// Select.stories.tsx
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';
import { SelectItems } from './SelectItems';
import { SelectItemsDemo, menuItems } from './examples';

const meta = {
  title: 'Molecules/SelectItems',
  component: SelectItems,
  render: SelectItemsDemo,
} satisfies Meta<typeof SelectItems>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: menuItems,
  },
};

export const SelectedItem: Story = {
  ...Default,
  play: async () => {
    await userEvent.click(screen.getByRole('combobox'));
    const optionList = await screen.findByRole('listbox');
    const inviteItem = within(optionList).getByRole('option', {
      name: 'Invite users',
    });
    await userEvent.dblClick(inviteItem);
    const selectedItem = screen.getByRole('combobox');
    expect(selectedItem.textContent).toBe('Invite users');
    await userEvent.click(screen.getByRole('combobox'));

    // Find the checked item using the data-state attribute with the value 'checked'
    const checkedItem = screen.getByRole('option', { name: 'Invite users' });

    // Check if the checked item's data-state attribute is "checked"
    expect(checkedItem.getAttribute('data-state')).toBe('checked');
  },
};
