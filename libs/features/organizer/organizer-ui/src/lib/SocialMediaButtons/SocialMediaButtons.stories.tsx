// libs/features/organizer/src/lib/SocialMediaButtons/SocialMediaButtons.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { SocialMediaButtons } from './SocialMediaButtons';

const meta = {
  component: SocialMediaButtons,
} satisfies Meta<typeof SocialMediaButtons>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TwoSocialMedia = {
  args: {
    platforms: [
      {
        platform: 'twitter',
        handle: 'PSG_inside',
      },
      {
        platform: 'discord',
        handle: '834227967404146718',
      },
    ],
  },
} satisfies Story;

export const AllSocialMedia = {
  args: {
    platforms: [
      {
        platform: 'twitter',
        handle: 'PSG_inside',
      },
      {
        platform: 'discord',
        handle: '834227967404146718',
      },
      {
        platform: 'instagram',
        handle: 'psg',
      },
      {
        platform: 'tiktok',
        handle: 'psg',
      },
      {
        platform: 'facebook',
        handle: 'PSG',
      },
      {
        platform: 'youtube',
        handle: 'psg',
      },
      {
        platform: 'twitch',
        handle: 'psg',
      },
      {
        platform: 'telegram',
        handle: 'psg',
      },
    ],
  },
} satisfies Story;

export const AllSocialMediaWithMobile = {
  ...AllSocialMedia,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} satisfies Story;
