// PassList.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { default as passCardMeta } from '../../molecules/PassCard/PassCard.stories';
import { PassList, PassListSkeleton } from './PassList';
import { passListProps } from './examples';

const meta = {
  component: PassList,
  args: passListProps,
  parameters: passCardMeta.parameters,
} satisfies Meta<typeof PassList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  render: () => <PassListSkeleton />,
};
