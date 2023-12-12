import { Organizer } from '@features/organizer/organizer-types';
import { RichTextField, RichTextFieldSkeleton } from '@next/hygraph';
import { CardContent } from '@ui/components';
import {
  OrganizerHero,
  OrganizerHeroProps,
  OrganizerHeroSkeleton,
} from '../OrganizerHero/OrganizerHero';
import {
  SocialMediaButtons,
  SocialMediaButtonsProps,
  SocialMediaButtonsSkeleton,
} from '../SocialMediaButtons/SocialMediaButtons';

export interface OrganizerSectionProps
  extends OrganizerHeroProps,
    Pick<Organizer, 'description'> {
  className?: string;
}

export const OrganizerSection: React.FC<OrganizerSectionProps> = ({
  description,
  twitterHandle,
  instagramHandle,
  tiktokHandle,
  facebookHandle,
  youtubeHandle,
  telegramHandle,
  discordWidgetId,
  ...props
}) => {
  const platforms = [
    twitterHandle && { platform: 'twitter', handle: twitterHandle },
    instagramHandle && { platform: 'instagram', handle: instagramHandle },
    tiktokHandle && { platform: 'tiktok', handle: tiktokHandle },
    facebookHandle && { platform: 'facebook', handle: facebookHandle },
    youtubeHandle && { platform: 'youtube', handle: youtubeHandle },
    telegramHandle && { platform: 'telegram', handle: telegramHandle },
    discordWidgetId && { platform: 'discord', handle: discordWidgetId },
  ].filter(Boolean) as SocialMediaButtonsProps['platforms'];
  return (
    <>
      <OrganizerHero {...props} />
      <CardContent className="mb-0 space-y-2 md:space-y-4" isMain>
        <SocialMediaButtons platforms={platforms} />
        {description && (
          <RichTextField
            content={description.json}
            references={description.references}
          />
        )}
      </CardContent>
    </>
  );
};

export const OrganizerSectionSkeleton: React.FC = () => (
  <>
    <OrganizerHeroSkeleton />
    <CardContent className="mt-4 space-y-4 md:space-y-8" isMain>
      <SocialMediaButtonsSkeleton numItems={4} />
      <RichTextFieldSkeleton />
    </CardContent>
  </>
);
