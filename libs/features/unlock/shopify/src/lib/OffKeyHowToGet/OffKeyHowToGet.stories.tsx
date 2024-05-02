import { StoryObj, type Meta } from '@storybook/react';
import { OffKeyHowToGet } from './OffKeyHowToGet';

const meta = {
  component: OffKeyHowToGet,
  parameters: {
    layout: 'centered',
  },
  args: {
    href: '/shopify/off-key-how-to-get',
  },
} satisfies Meta<typeof OffKeyHowToGet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
