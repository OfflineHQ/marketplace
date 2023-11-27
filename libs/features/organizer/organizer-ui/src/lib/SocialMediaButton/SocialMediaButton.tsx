import dynamic from 'next/dynamic';

import FacebookWidget from './FacebookWidget';
import InstagramWidget from './InstagramWidget';
import TwitterWidget from './TwitterWidget';

import {
  Button,
  ButtonProps,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@ui/components';
import {
  Discord,
  Facebook,
  Instagram,
  Telegram,
  TikTok,
  Twitch,
  Twitter,
  Youtube,
} from '@ui/icons';
import { VariantProps, cva } from 'class-variance-authority';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import TikTokWidget from './TikTokWidget';
import YouTubeWidget from './YouTubeWidget';

const socialMediaVariants = {
  twitter: Twitter,
  instagram: Instagram,
  tiktok: TikTok,
  facebook: Facebook,
  youtube: Youtube,
  twitch: Twitch,
  discord: Discord,
  telegram: Telegram,
};

export const platformsVariants = Object.keys(socialMediaVariants) as Array<
  keyof typeof socialMediaVariants
>;

const socialMediaUrls = {
  twitter: 'https://www.twitter.com/',
  instagram: 'https://www.instagram.com/',
  tiktok: 'https://www.tiktok.com/@',
  facebook: 'https://www.facebook.com/',
  youtube: 'https://www.youtube.com/user/',
  twitch: 'https://www.twitch.tv/',
  discord: 'https://discord.gg/',
  telegram: 'https://t.me/',
};

const socialMediaButtonVariantsCva = cva({
  variants: {
    platform: socialMediaVariants,
  },
  defaultVariants: {
    platform: 'twitter',
  },
});

export interface SocialMediaButtonProps
  extends Omit<ButtonProps, 'icon'>,
    VariantProps<typeof socialMediaButtonVariantsCva> {
  platform: keyof typeof socialMediaVariants;
  handle: string;
}

const DiscordWidget = dynamic(() => import('./DiscordWidget'), { ssr: false });
const TwitchWidget = dynamic(() => import('./TwitchWidget'), { ssr: false });

const SocialMediaHoverContent: React.FC<{
  platform: keyof typeof socialMediaVariants;
  handle: string;
}> = ({ platform, handle }) => {
  const t = useTranslations('Organizer.SocialMediaButton');
  switch (platform) {
    case 'twitter':
      return <TwitterWidget handle={handle} />;
    case 'discord':
      return <DiscordWidget handle={handle} />;
    case 'instagram':
      return <InstagramWidget handle={handle} />;
    case 'facebook':
      return <FacebookWidget handle={handle} />;
    case 'tiktok':
      return <TikTokWidget handle={handle} />;
    case 'twitch':
      return <TwitchWidget handle={handle} />;
    case 'youtube':
      return <YouTubeWidget handle={handle} />;
    // Add more cases for other platforms
    default:
      return (
        <HoverCardContent side="top" className="w-fit p-2 text-sm">
          <div>{t('go-to-platform', { platform })}</div>
        </HoverCardContent>
      );
  }
};

export const SocialMediaButton: React.FC<SocialMediaButtonProps> = ({
  platform,
  handle,
  variant = 'ghost',
  ...props
}) => {
  const IconComponent = socialMediaVariants[platform];

  return (
    <HoverCard>
      <HoverCardTrigger className="w-fit">
        <Link
          href={socialMediaUrls[platform] + handle}
          rel="noopener noreferrer"
          target="_blank"
          legacyBehavior
        >
          <Button
            {...props}
            variant={variant}
            icon={<IconComponent />}
            isIconOnly={true}
          />
        </Link>
      </HoverCardTrigger>
      <SocialMediaHoverContent platform={platform} handle={handle} />
    </HoverCard>
  );
};
