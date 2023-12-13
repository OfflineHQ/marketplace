import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { HoverCard } from './HoverCard';
import { HoverCardDemo } from './examples';

const meta = {
  component: HoverCard,
  title: 'Molecules/HoverCard',
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    userEvent.hover(screen.getByText('@nextjs'));

    await screen.findByText(
      'The React Framework – created and maintained by @vercel.',
    );
  },
  render: HoverCardDemo,
};
