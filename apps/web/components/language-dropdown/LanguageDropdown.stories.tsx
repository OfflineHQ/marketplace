import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { LanguageDropdown } from './LanguageDropdown';
import { LanguageDropdownExample, languageItems } from './examples';

const helperText = 'Select a language';

const meta = {
  component: LanguageDropdown,
  render: LanguageDropdownExample,
  args: {
    items: languageItems,
    helperText,
  },
} satisfies Meta<typeof LanguageDropdown>;

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
    await screen.findByText('Español');
    await screen.findByText('Français');
  },
};
