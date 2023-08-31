import type { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

import { SinglePass } from './SinglePass';
import {
  SinglePassSkeletonExample,
  eventPassNft1,
  eventPassNft2,
  SinglePassNoUserExample,
  SinglePassOwnerExample,
  owner,
} from './examples';

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
    screen.getByText(/unrevealed pass/i);
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
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const NotRevealedPassWithMobile: Story = {
  ...NotRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const NotRevealedPassWithMobileDarkMode: Story = {
  ...NotRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    darkMode: {
      isDark: true,
    },
  },
};

export const RevealedPass: Story = {
  ...NotRevealedPass,
  args: {
    eventPassNft: eventPassNft2,
  },
  play: async ({ container }) => {
    screen.getByText(/caution/i);
    screen.getByRole('button', { name: /event/i });
    screen.getByRole('button', { name: /Test Organizer 2/i });
  },
};

export const RevealedPassWithMobile: Story = {
  ...RevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const OwnerNotRevealedPass: Story = {
  render: SinglePassOwnerExample,
  args: {
    user: owner,
  },
  play: async ({ container }) => {
    screen.getByText(/action required/i);
    screen.getByRole('button', { name: /event/i });
    screen.getByRole('button', { name: /Test Organizer/i });
    screen.getByRole('button', { name: /reveal/i });
  },
};

export const OwnerNotRevealedPassWithMobile: Story = {
  ...OwnerNotRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const OwnerNotRevealedPassWithMobileDarkMode: Story = {
  ...OwnerNotRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    darkMode: {
      isDark: true,
    },
  },
};

export const OwnerRevealedPass: Story = {
  ...OwnerNotRevealedPass,
  args: {
    user: owner,
    eventPassNft: eventPassNft2,
  },
  play: async ({ container }) => {
    screen.getByRole('button', { name: /event/i });
    screen.getByRole('button', { name: /Test Organizer 2/i });
    screen.getByRole('button', { name: /download/i });
  },
};

export const OwnerRevealedPassWithMobile: Story = {
  ...OwnerRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const OwnerRevealedPassWithMobileDarkMode: Story = {
  ...OwnerRevealedPass,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    darkMode: {
      isDark: true,
    },
  },
};

// export const SectionWithUser: Story = {
//   render: UserPassExample,
// };
//

// export const SectionWithNormalUser: Story = {
//   args: {
//     children: <AppNavLayout {...WithNormalUser.args} />,
//   },
// };
