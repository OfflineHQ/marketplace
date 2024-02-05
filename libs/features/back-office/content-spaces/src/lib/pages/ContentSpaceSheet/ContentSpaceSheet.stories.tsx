import { Meta, StoryObj } from '@storybook/react';
import { ContentSpaceSheet } from './ContentSpaceSheet';
import {
  ContentSpaceSheetExample,
  contentSpaceDataUndefined,
} from './examples';

const meta: Meta<typeof ContentSpaceSheet> = {
  component: ContentSpaceSheet,
  parameters: {
    layout: 'fullscreen',
    // moduleMock: {
    // 	mock: contentSpaceSheetMocks,
    // },
  },
  render: ContentSpaceSheetExample,
  args: {
    contentSpace: contentSpaceDataUndefined,
    organizerId: 'organizer-1',
  },
};

export default meta;

type Story = StoryObj<typeof ContentSpaceSheet>;

export const Default: Story = {};
