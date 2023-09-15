import { expect } from '@storybook/jest';
import type { Meta, StoryObj } from '@storybook/react';
import {
  screen,
  fireEvent,
  userEvent,
  within,
  waitFor,
  waitForElementToBeRemoved,
} from '@storybook/testing-library';
import { sleep } from '@utils';

import { UserPass } from './UserPass';
import { UserPassExample } from './examples';
import {
  UserPassListExample,
  UserPassListSkeletonExample,
  actionsFunctions,
  batchDownloadOrReveal,
  eventParameters,
  eventParameters2,
} from '../../organisms/UserPassList/examples';
// @ts-ignore
import EmptyPassImage from './empty-pass.svg';

const meta: Meta<typeof UserPass> = {
  component: UserPass,
  parameters: {
    layout: 'fullscreen',
  },
  render: UserPassExample,
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={actionsFunctions}
        batchDownloadOrReveal={batchDownloadOrReveal}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
};

export default meta;

type Story = StoryObj<typeof UserPass>;

export const WithUser: Story = {};

export const WithUserMobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserDarkMode: Story = {
  ...WithUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
  },
};

export const WithUserDarkModeMobileWithTimezoneDialog: Story = {
  ...WithUser,
  parameters: {
    darkMode: {
      isDark: true,
    },
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        batchDownloadOrReveal={batchDownloadOrReveal}
        actionsFunctions={actionsFunctions}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const button = screen.getByLabelText('Fill Info');
    userEvent.click(screen.getByText(/World cup/i));
    userEvent.click(button);
  },
};

export const WithUserNoData: Story = {
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        batchDownloadOrReveal={batchDownloadOrReveal}
        actionsFunctions={actionsFunctions}
        eventsParameters={[]}
      />
    ),
  },
};

export const WithUserNoDataMobile: Story = {
  ...WithUserNoData,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithUserLoading: Story = {
  args: {
    children: <UserPassListSkeletonExample />,
  },
};

export const WithUserWithMobileLoading: Story = {
  ...WithUserLoading,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

async function clickOnBatchDownloadButton() {
  const batchDownloadButton = screen.getByRole('button', {
    name: /Download 2 passes/i,
  });
  userEvent.click(batchDownloadButton);
}

export const DownloadPassesSuccess: Story = {
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
  play: async ({ canvasElement }) => {
    await clickOnBatchDownloadButton();
    // Check for a toast on success
    const toastElement = await screen.findByRole('status');
    expect(toastElement).not.toHaveClass('destructive');
  },
};

export const DownloadPassesError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={actionsFunctions}
        batchDownloadOrReveal={async () => {
          throw new Error('Error');
        }}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    await clickOnBatchDownloadButton();
    // Check for a toast on error
    const toastElement = await screen.findByRole('alert');
    expect(toastElement).toHaveClass('destructive');
  },
};

async function clickOnDownloadButton() {
  const pass3Text = screen.getByText(/#3/i);
  const parentDiv = pass3Text.parentElement;
  if (parentDiv) {
    const button = within(parentDiv).getByRole('button');
    userEvent.click(button);
  }
  const allMenus = await screen.findAllByRole('menu');
  const openMenu = allMenus.find(
    (menu) => menu.getAttribute('data-state') === 'open'
  );
  const downloadButton = within(openMenu).getByText('Download');
  await userEvent.click(downloadButton);
}

export const DownloadOnePassSuccess: Story = {
  ...DownloadPassesSuccess,
  play: async ({ canvasElement }) => {
    await clickOnDownloadButton();
    expect(await screen.findByRole('status')).toBeInTheDocument();
    // Check for a toast on success
    const toastDescription = await screen.findByText(/Pass downloaded/i);
    expect(toastDescription).toBeVisible();
  },
};

export const DownloadOnePassError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={{
          ...actionsFunctions,
          downloadPass: async () => {
            throw new Error('Error');
          },
        }}
        batchDownloadOrReveal={batchDownloadOrReveal}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    await clickOnDownloadButton();
    expect(await screen.findByRole('status')).toBeInTheDocument();
    // Check for a toast on error
    const toastElement = await screen.findByRole('alert');
    expect(toastElement).toHaveClass('destructive');
    expect(toastElement).toHaveTextContent(/Error/i);
  },
};

async function clickOnRevealButton() {
  const pass3Text = screen.getByText(/#1,198/i);
  const parentDiv = pass3Text.parentElement;
  if (parentDiv) {
    const button = within(parentDiv).getByRole('button');
    userEvent.click(button);
  }
  const revealButton = await screen.findByLabelText('Reveal');
  await userEvent.click(revealButton);
  expect(await screen.findByRole('status')).toBeInTheDocument();
}

export const RevealOnePassSuccess: Story = {
  ...DownloadPassesSuccess,
  play: async ({ canvasElement }) => {
    await clickOnRevealButton();
    // Check for a toast on success
    const toastDescription = await screen.findByText(/Pass revealed/i);
    expect(toastDescription).toBeVisible();
  },
};

export const RevealOnePassError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage={EmptyPassImage}
        actionsFunctions={{
          ...actionsFunctions,
          revealPass: async () => {
            throw new Error('Error');
          },
        }}
        batchDownloadOrReveal={batchDownloadOrReveal}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    await clickOnRevealButton();
    // Check for a toast on error
    const toastElement = await screen.findByRole('alert');
    expect(toastElement).toHaveClass('destructive');
    expect(toastElement).toHaveTextContent(/Error/i);
  },
};
