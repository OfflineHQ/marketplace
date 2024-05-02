// Drawer.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent } from '@storybook/test';
import { DrawerDemo } from './examples';

import { Drawer } from './Drawer';

const meta = {
  title: 'Organisms/Drawer',
  component: Drawer,
  render: DrawerDemo,
} satisfies Meta<typeof Drawer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const OpenDrawer: Story = {
  play: async () => {
    const drawerTrigger = screen.getByRole('button', { name: /open drawer/i });
    await userEvent.click(drawerTrigger);

    const drawerTitle = await screen.findByText(/move goal/i);
    await expect(drawerTitle).toBeVisible();

    const drawerDescription = await screen.findByText(
      /Set your daily activity goal./i,
    );
    await expect(drawerDescription).toBeVisible();
  },
};

export const CloseDrawer: Story = {
  play: async (props) => {
    await OpenDrawer.play(props);
    await fireEvent.click(
      await screen.findByRole('button', { name: /cancel/i }),
    );
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
};
