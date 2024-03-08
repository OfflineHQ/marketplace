import { StoryObj, type Meta } from '@storybook/react';
import { Check } from '@ui/icons';
import { Avatar, AvatarFallback } from '../avatar/Avatar';
import { IconBadgeWrapper } from './IconBadgeWrapper';
const meta = {
  component: IconBadgeWrapper,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof IconBadgeWrapper>;
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <Avatar>
        <AvatarFallback>TEST</AvatarFallback>
      </Avatar>
    ),
    icon: <Check size="sm" />,
  },
};

export const WithColorBackground: Story = {
  args: {
    ...Default.args,
    className: 'bg-green-200 p-0.5',
  },
};
