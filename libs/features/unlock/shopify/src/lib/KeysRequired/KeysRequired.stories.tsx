import { StoryObj, type Meta } from '@storybook/react';
import { firstKey, secondKey } from '../KeyRequired/examples';
import { KeysRequired } from './KeysRequired';

const meta = {
  component: KeysRequired,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof KeysRequired>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithOneKey: Story = {
  args: {
    keys: [firstKey],
  },
};

export const WithTwoKeys: Story = {
  args: {
    keys: [firstKey, secondKey],
    separatorText: 'or',
  },
};

export const WithTwoKeysOwnedNotOwned: Story = {
  args: {
    keys: [
      { ...firstKey, isOwned: true },
      { ...secondKey, isOwned: false },
    ],
    separatorText: 'or',
  },
};
