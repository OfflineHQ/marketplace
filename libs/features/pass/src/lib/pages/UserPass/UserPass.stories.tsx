import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, within } from '@storybook/test';

import {
  UserPassListExample,
  UserPassListSkeletonExample,
  actionsFunctions,
  batchDownloadOrReveal,
  eventParameters,
  eventParameters2,
} from '../../organisms/UserPassList/examples';
import { UserPass } from './UserPass';
import { UserPassExample } from './examples';
import { darkMode, mobileMode } from '@test-utils/storybook';

const meta: Meta<typeof UserPass> = {
  component: UserPass,
  parameters: {
    layout: 'fullscreen',
  },
  render: UserPassExample,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty-pass.svg"
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
    ...mobileMode,
  },
};

export const WithUserDarkMode: Story = {
  ...WithUser,
  parameters: {
    ...darkMode,
  },
};

export const WithUserNoData: Story = {
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty-pass.svg"
        batchDownloadOrReveal={batchDownloadOrReveal}
        actionsFunctions={actionsFunctions}
        eventsParameters={[]}
      />
    ),
  },
};

export const WithUserMintingOrders: Story = {
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty-pass.svg"
        batchDownloadOrReveal={batchDownloadOrReveal}
        actionsFunctions={actionsFunctions}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  render: (args) => <UserPassExample numMintingOrders={4} {...args} />,
};

export const WithUserDialogTimezone: Story = {
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
        batchDownloadOrReveal={batchDownloadOrReveal}
        actionsFunctions={actionsFunctions}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    userEvent.click(await screen.findByLabelText('Fill Info'));
    await screen.findByText(/In your own time zone/i);
  },
};

export const WithUserNoDataMobile: Story = {
  ...WithUserNoData,
  parameters: {
    ...mobileMode,
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
    ...mobileMode,
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
    // await clickOnBatchDownloadButton();
    // // Check for a toast on success
    // const toastElement = await screen.findByRole('status');
    // await expect(toastElement).not.toHaveClass('destructive');
  },
};

export const DownloadPassesError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
        actionsFunctions={actionsFunctions}
        batchDownloadOrReveal={async () => {
          throw new Error('Error');
        }}
        eventsParameters={[eventParameters, eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    // await clickOnBatchDownloadButton();
    // // Check for a toast on error
    // const toastElement = await screen.findByRole('alert');
    // await expect(toastElement).toHaveClass('destructive');
  },
};

export const BatchRevealDialogSuccess: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
        actionsFunctions={actionsFunctions}
        batchDownloadOrReveal={batchDownloadOrReveal}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    // await clickOnBatchDownloadButton();
    // // check for dialog
    // await screen.findByRole('dialog');
    // // Check for a toast on success
    // userEvent.click(await screen.findByLabelText('Reveal'));
    // const toastElement = await screen.findByRole('status');
    // await expect(toastElement).not.toHaveClass('destructive');
  },
};

export const BatchRevealDialogError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
        actionsFunctions={actionsFunctions}
        batchDownloadOrReveal={async () => {
          throw new Error('Error');
        }}
        eventsParameters={[eventParameters2]}
      />
    ),
  },
  play: async ({ canvasElement }) => {
    // await clickOnBatchDownloadButton();
    // // check for dialog
    // await screen.findByRole('dialog');
    // // Check for a toast on success
    // userEvent.click(await screen.findByLabelText('Reveal'));
    // await screen.findByText(/Error/i);
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
    (menu) => menu.getAttribute('data-state') === 'open',
  );
  const downloadButton = within(openMenu).getByText('Download');
  await userEvent.click(downloadButton);
}

export const DownloadOnePassSuccess: Story = {
  ...DownloadPassesSuccess,
  play: async ({ canvasElement }) => {
    // await clickOnDownloadButton();
    // // check that the download button is loading
    // expect(await screen.findByRole('status')).toBeInTheDocument();
    // // Check for a toast on success
    // const toastDescription = await screen.findByText(/Pass downloaded/i);
    // await expect(toastDescription).toBeVisible();
  },
};

export const DownloadOnePassError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
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
    // await clickOnDownloadButton();
    // // check that the download button is loading
    // expect(await screen.findByRole('status')).toBeInTheDocument();
    // // Check for a toast on error
    // const toastElement = await screen.findByRole('alert');
    // await expect(toastElement).toHaveClass('destructive');
    // expect(toastElement).toHaveTextContent(/Error/i);
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
    // await clickOnRevealButton();
    // // Check for a toast on success
    // const toastDescription = await screen.findByText(/Pass revealed/i);
    // await expect(toastDescription).toBeVisible();
  },
};

export const RevealOnePassError: Story = {
  ...DownloadPassesSuccess,
  args: {
    children: (
      <UserPassListExample
        noPassImage="/empty"
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
    // await clickOnRevealButton();
    // // Check for a toast on error
    // const toastElement = await screen.findByRole('alert');
    // await expect(toastElement).toHaveClass('destructive');
    // expect(toastElement).toHaveTextContent(/Error/i);
  },
};
