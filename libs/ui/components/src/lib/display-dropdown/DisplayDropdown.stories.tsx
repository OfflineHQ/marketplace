import type { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { DisplayDropdown } from './DisplayDropdown';
import { DisplayDropdownExample, displayItems, displayItemsDark } from './examples';

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
      // Set the initial theme
      current: 'dark',
    },
  },
  play: undefined,
  // play: async ({ canvasElement }) => {
  //   const button = screen.getByRole('button');
  //   await userEvent.hover(button);
  //   // Check that the helper text is present
  //   await screen.findByText((content, element) => {
  //     return (
  //       element?.getAttribute('data-state') === 'delayed-open' &&
  //       content.includes(helperText)
  //     );
  //   });
  //   await userEvent.click(button);
  //   // Check that the language items are present
  //   await screen.findByText('Light');
  //   await screen.findByText('Dark');
  // },
};
