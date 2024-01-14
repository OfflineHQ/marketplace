import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { Badge } from '../badge/Badge';
import { PopoverInfo, PopoverInfoProps, iconSizes } from './PopoverInfo';
import { darkMode } from '@test-utils/storybook';

export default {
  title: 'Molecules/PopoverInfo',
  component: PopoverInfo,
} as Meta<typeof PopoverInfo>;

type PopoverInfoStory = StoryObj<PopoverInfoProps>;

export const WithBadge: PopoverInfoStory = {
  args: {
    children: <Badge>Click for Info</Badge>,
    title: 'Popover Title',
    description: 'This is a description for the PopoverInfo component.',
  },
};

export const LongDescription: PopoverInfoStory = {
  args: {
    children: <Badge>Click for Info</Badge>,
    title: 'Popover Title',
    description:
      'This is a much longer description to show how the PopoverInfo component handles more content. It should wrap and maintain its styling without overflow issues.',
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByText(/click for info/i));
    await screen.findByText(
      'This is a much longer description to show how the PopoverInfo component handles more content. It should wrap and maintain its styling without overflow issues.',
    );
  },
};

export const LongDescriptionDarkMode: PopoverInfoStory = {
  ...LongDescription,
  play: undefined,
  parameters: {
    ...darkMode,
  },
};

export const WithAllIconSizes: PopoverInfoStory = {
  render: (props) => (
    <div className="flex flex-wrap items-end justify-center gap-4">
      {(Object.keys(iconSizes) as Array<keyof typeof iconSizes>).map((key) => (
        <PopoverInfo {...props} key={key} iconSize={key}>
          <Badge size={key}>Click for Info</Badge>
        </PopoverInfo>
      ))}
    </div>
  ),
  args: {
    title: 'Popover Title',
    description: 'This is a description for the PopoverInfo component.',
  },
};
