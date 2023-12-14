// Tooltip.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { Plus } from '@ui/icons';
import { Button } from '../button/Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  render: () => (
    <div className="flex">
      <Tooltip content="Add to library">
        <Button icon={<Plus />} variant="outline" />
      </Tooltip>
    </div>
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
