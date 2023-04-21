// Tooltip.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { Tooltip, TooltipProps } from './Tooltip';
import { Button } from '../button/Button';
import { Plus } from '@ui/icons';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  render: () => (
    <Tooltip content="Add to library">
      <Button icon={Plus} variant="outline" />
    </Tooltip>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const messageText = 'Add to library';
    userEvent.hover(screen.getByRole('button'));

    await screen.findByText((content, element) => {
      return (
        element?.getAttribute('data-state') === 'delayed-open' &&
        content.includes(messageText)
      );
    });
  },
};
