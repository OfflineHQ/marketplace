import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';

import { SinglePass } from './SinglePass';
import {
  SinglePassNoUserExample,
  SinglePassOwnerExample,
  SinglePassSkeletonExample,
  eventPassNft1,
  eventPassNft2,
  owner,
} from './examples';
import { darkMode, mobileMode } from '@test-utils/storybook-modes';

// Import the stories you want to reuse

const meta: Meta<typeof SinglePass> = {
  component: SinglePass,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    eventPassNft: eventPassNft1,
  },
} satisfies Meta<typeof SinglePass>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NotRevealedPass: Story = {
  render: SinglePassNoUserExample,
  play: async ({ container }) => {
    await screen.findByText(/unrevealed pass/i);
    screen.getByRole('button', { name: /event/i });
    screen.getByRole('button', { name: /Test Organizer/i });
    userEvent.click(screen.getByRole('button', { name: /VIP Access/i }));
    userEvent.click(screen.getByRole('button', { name: /Backstage Access/i }));
  },
};

export const Loading: Story = {
  render: SinglePassSkeletonExample,
};

export const LoadingMobile: Story = {
  ...Loading,
  parameters: {
    ...mobileMode,
  },
};

export const NotRevealedPassWithMobile: Story = {
  ...NotRevealedPass,
  parameters: {
    ...mobileMode,
  },
};

export const NotRevealedPassWithMobileDarkMode: Story = {
  ...NotRevealedPass,
  parameters: {
    ...mobileMode,
    ...darkMode,
  },
};

export const RevealedPass: Story = {
  ...NotRevealedPass,
  args: {
    eventPassNft: eventPassNft2,
  },
  play: async ({ container }) => {
    await screen.findByText(/caution/i);
    screen.getByRole('button', { name: /event/i });
    screen.getByRole('button', { name: /Test Organizer 2/i });
  },
};

export const RevealedPassWithMobile: Story = {
  ...RevealedPass,
  parameters: {
    ...mobileMode,
  },
};

export const OwnerNotRevealedPass: Story = {
  render: SinglePassOwnerExample,
  args: {
    user: owner,
  },
  play: async ({ container }) => {
    await screen.findByText(/action required/i);
    screen.getByRole('button', { name: /passes/i });
    screen.getByRole('button', { name: /Test Organizer/i });
    screen.getByRole('button', { name: /reveal/i });
  },
};

export const OwnerNotRevealedPassWithMobile: Story = {
  ...OwnerNotRevealedPass,
  parameters: {
    ...mobileMode,
  },
};

export const OwnerNotRevealedPassWithMobileDarkMode: Story = {
  ...OwnerNotRevealedPass,
  parameters: {
    ...mobileMode,
    ...darkMode,
  },
};

export const OwnerRevealedPass: Story = {
  ...OwnerNotRevealedPass,
  args: {
    user: owner,
    eventPassNft: eventPassNft2,
  },
  play: async ({ container }) => {
    await screen.findByRole('button', { name: /passes/i });
    screen.getByRole('button', { name: /Test Organizer 2/i });
    screen.getByRole('button', { name: /download/i });
  },
};

export const OwnerRevealedPassWithMobile: Story = {
  ...OwnerRevealedPass,
  parameters: {
    ...mobileMode,
  },
};

export const OwnerRevealedPassWithMobileDarkMode: Story = {
  ...OwnerRevealedPass,
  parameters: {
    ...mobileMode,
    ...darkMode,
  },
};

// export const SectionWithUser: Story = {
//   render: UserPassExample,
// };
//

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithUserEmail.args} />,
//   },
// };
