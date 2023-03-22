import { Meta, StoryObj } from '@storybook/react';
import { screen, fireEvent, userEvent, within } from '@storybook/testing-library';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard';
import { Avatar, AvatarImage, AvatarFallback } from '../avatar/Avatar';
import { Button } from '../button/Button';
import { OutlineCalendarDays } from '../icons';

const meta = {
  component: HoverCard,
  title: 'Molecules/HoverCard',
} satisfies Meta<typeof HoverCard>;

export default meta;

type Story = StoryObj<typeof meta>;

function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@nextjs</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@nextjs</h4>
            <p className="text-sm">
              The React Framework – created and maintained by @vercel.
            </p>
            <div className="flex items-center pt-2">
              <OutlineCalendarDays className="mr-2 h-4 w-4 opacity-70" />{' '}
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Joined December 2021
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    userEvent.hover(screen.getByText('@nextjs'));

    await screen.findByText('The React Framework – created and maintained by @vercel.');
  },
  render: HoverCardDemo,
};
