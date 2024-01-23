import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCardContent,
  TextSkeleton,
} from '@ui/components';
import { useLocale } from 'next-intl';
import { Suspense } from 'react';

// https://developers.google.com/youtube/v3/docs/channels
const YouTubeWidgetContent = async ({ handle }: { handle: string }) => {
  let profileInfo: any = null;
  try {
    // TODO replace with env.YOUTUBE_OEMBED_API_KEY
    // TODO, add localization to the API call and show the right language title and description if exist, otherwise show the default one
    const locale = useLocale();
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&part=brandingSettings&forUsername=${handle}&key=AIzaSyCZns5-IBq3Fqpv8Rua_GNpYtO224o-tEU&hl=${locale}`,
    );
    const data = await response.json();
    profileInfo = data?.items?.[0].snippet;
  } catch (error) {
    console.error('Error fetching YouTube profile:', error);
  }
  //TODO adapt with right layout and Next Image
  return profileInfo ? (
    <div className="flex items-center justify-between space-x-4">
      <Avatar>
        <AvatarImage src={profileInfo.thumbnails?.default?.url} />
        <AvatarFallback>{profileInfo.title?.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col space-y-2">
        <h4 className="text-sm font-semibold">{profileInfo.localized.title}</h4>
        {profileInfo.description && (
          <p className="text-sm">{profileInfo.description}</p>
        )}
      </div>
    </div>
  ) : null;
};

const YouTubeWidget = ({ handle }: { handle: string }) => (
  <HoverCardContent className="size-fit">
    <Suspense fallback={<TextSkeleton variant="p" />}>
      <YouTubeWidgetContent handle={handle} />
    </Suspense>
  </HoverCardContent>
);

export default YouTubeWidget;
