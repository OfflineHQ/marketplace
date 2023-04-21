import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { DisplayDropdown } from './DisplayDropdown';
import { DisplayDropdownExample, displayItems, displayItemsDark } from './examples';
import { sleep } from '@utils';

const helperText = 'Select a display mode';

const meta = {
  title: 'Molecules/DisplayDropdown',
  component: DisplayDropdown,
  render: DisplayDropdownExample,
  args: {
    items: displayItems,
    helperText,
  },
} satisfies Meta<typeof DisplayDropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    await screen.findByLabelText('Light', { selector: 'svg' });
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
    await screen.findByText('Light');
    await screen.findByText('Dark');
  },
};

export const Dark: Story = {
  args: {
    items: displayItemsDark,
  },
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
  play: async ({ canvasElement }) => {
    await sleep(300);
    await screen.findByLabelText('Dark', { selector: 'svg' });
  },
};
