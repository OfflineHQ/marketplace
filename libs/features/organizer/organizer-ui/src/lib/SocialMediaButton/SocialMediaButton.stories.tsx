import { Meta, StoryObj } from '@storybook/react';
import { screen, userEvent } from '@storybook/test';
import { sleep } from '@utils';
import { SocialMediaButton } from './SocialMediaButton';

const meta = {
  component: SocialMediaButton,
} satisfies Meta<typeof SocialMediaButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Twitter = {
  args: {
    platform: 'twitter',
    handle: 'PSG_inside',
  },
} satisfies Story;

export const Discord = {
  args: {
    platform: 'discord',
    handle: '834227967404146718',
  },
} satisfies Story;

export const DiscordWithIframe = {
  args: {
    platform: 'discord',
    handle: '834227967404146718',
  },
  parameters: {
    chromatic: { disableSnapshot: true },
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(screen.getByRole('button'));
    await screen.findByTestId('iframe');
  },
} satisfies Story;

export const Instagram = {
  args: {
    platform: 'instagram',
    handle: 'psg',
  },
} satisfies Story;

export const TikTok = {
  args: {
    platform: 'tiktok',
    handle: 'psg',
  },
} satisfies Story;

export const Facebook = {
  args: {
    platform: 'facebook',
    handle: 'PSG',
  },
} satisfies Story;

export const Youtube = {
  args: {
    platform: 'youtube',
    handle: 'psg',
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(screen.getByRole('button'));
    await sleep(1000);
    await screen.findByText(/psg/i);
  },
} satisfies Story;

export const Twitch = {
  args: {
    platform: 'twitch',
    handle: 'psg',
  },
} satisfies Story;

export const Telegram = {
  args: {
    platform: 'telegram',
    handle: 'psg',
  },
  play: async ({ canvasElement }) => {
    await userEvent.hover(screen.getByRole('button'));
    // await screen.findByText(/go to telegram/i);
  },
} satisfies Story;
