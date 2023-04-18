// NavigationMenu.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { expect } from '@storybook/jest';
import {
  fireEvent,
  screen,
  userEvent,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';
import { NavigationMenu } from './NavigationMenu';
import { NavigationMenuDemo } from './examples';

const meta = {
  component: NavigationMenu,
  title: 'Molecules/NavigationMenu',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultNavigationMenu: Story = {
  render: () => <NavigationMenuDemo />,
  play: async () => {
    const gettingStartedTrigger = await screen.findByRole('button', {
      name: 'Getting started',
    });
    await userEvent.click(gettingStartedTrigger);
    const gettingStartedContent = await screen.findByText('Introduction');
    expect(gettingStartedContent).toBeVisible();

    const componentsTrigger = await screen.findByRole('button', {
      name: 'Components',
    });
    await userEvent.click(componentsTrigger);
    await waitForElementToBeRemoved(() => screen.queryByText('Introduction'));
    const componentsContent = await screen.findByText('Hover Card');
    console.log({ componentsContent });
    expect(componentsContent).toBeVisible();
  },
};
