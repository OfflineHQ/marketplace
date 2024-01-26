import type { Meta, StoryObj } from '@storybook/react';

import { expect, screen, userEvent, within } from '@storybook/test';
import { ContentSpacesTableExample, contentSpacesTableData } from './examples';

import { ContentSpacesTable } from './ContentSpacesTable';

const meta: Meta<typeof ContentSpacesTable> = {
  component: ContentSpacesTable,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/perks/content-spaces',
      },
    },
  },
  render: ContentSpacesTableExample,
  args: {
    contentSpaces: contentSpacesTableData,
  },
};

export default meta;

type Story = StoryObj<typeof ContentSpacesTable>;

export const Default: Story = {
  play: async ({ container }) => {
    const textElement = await screen.findAllByText(/Tech Conference/i);
    expect(textElement[0]).toBeInTheDocument();
    const buttonFileRow = within(
      textElement[0].closest('tr') as HTMLElement,
    ).getByRole('button');
    userEvent.click(buttonFileRow);
    const fileActionEdit = await screen.findByText(/Edit/i);
    userEvent.click(fileActionEdit);
  },
};
