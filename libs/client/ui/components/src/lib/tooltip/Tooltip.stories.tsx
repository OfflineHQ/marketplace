// Tooltip.stories.tsx
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { Tooltip, TooltipProps } from './Tooltip';
import { Button } from '../button/Button';
import { HiPlus } from 'react-icons/hi';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  render: () => (
    <Tooltip content="Add to library">
      <Button aria-label="Add" variant="outline" className="w-10 rounded-full p-0">
        <HiPlus className="h-4 w-4" />
        <span className="sr-only">Add</span>
      </Button>
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const messageText = 'Add to library';
    userEvent.hover(screen.getByLabelText(/add/i));

    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes(messageText)
      );
    });
  },
};
