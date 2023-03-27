import { expect } from '@storybook/jest';
// Select.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent, within } from '@storybook/testing-library';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select';

const meta = {
  title: 'Molecules/Select',
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

function SelectDemo() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetables</SelectLabel>
          <SelectItem value="aubergine">Aubergine</SelectItem>
          <SelectItem value="broccoli">Broccoli</SelectItem>
          <SelectItem value="carrot" disabled>
            Carrot
          </SelectItem>
          <SelectItem value="courgette">Courgette</SelectItem>
          <SelectItem value="leek">Leek</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Meat</SelectLabel>
          <SelectItem value="beef">Beef</SelectItem>
          <SelectItem value="chicken">Chicken</SelectItem>
          <SelectItem value="lamb">Lamb</SelectItem>
          <SelectItem value="pork">Pork</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export const Default: Story = {
  render: () => <SelectDemo />,
};

export const SelectedItem: Story = {
  render: () => <SelectDemo />,
  play: async () => {
    await userEvent.click(screen.getByRole('combobox'));
    const optionList = await screen.findByRole('listbox');
    const appleItem = within(optionList).getByRole('option', { name: 'Banana' });
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
