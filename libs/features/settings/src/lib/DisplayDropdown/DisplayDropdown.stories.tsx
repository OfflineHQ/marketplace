import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { DisplayDropdown } from './DisplayDropdown';
import { DisplayDropdownExample, displayItems } from './examples';

const helperText = 'Select a display mode';

const meta = {
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
    await screen.findByLabelText('Dark Light Auto', { selector: 'svg' });
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
