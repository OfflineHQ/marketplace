import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { CurrencyDropdown } from './CurrencyDropdown';
import { CurrencyDropdownExample, currencyItems } from './examples';

const helperText = 'Select a language';

const meta = {
  title: 'Molecules/CurrencyDropdown',
  component: CurrencyDropdown,
  render: CurrencyDropdownExample,
  args: {
    items: currencyItems,
    helperText,
  },
} satisfies Meta<typeof CurrencyDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const button = screen.getByRole('button');
    await userEvent.hover(button);
    // Check that the helper text is present
    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes(helperText)
      );
    });
    await userEvent.click(button);
    // Check that the language items are present
    await screen.findByText('EUR');
    await screen.findByText('USD');
  },
};
