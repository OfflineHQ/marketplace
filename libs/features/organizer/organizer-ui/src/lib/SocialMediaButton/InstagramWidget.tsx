'use server';

import { HoverCardContent, TextSkeleton } from '@ui/components';
import { Suspense } from 'react';

const InstagramWidgetContent = async ({ handle }: { handle: string }) => {
  let profileInfo = '';
  try {
    //TODO change for env.FACEBOOK_API_TOKEN
    const response = await fetch(
      `https://graph.facebook.com/v18.0/instagram_oembed?url=https://www.instagram.com/${handle}/&access_token=1067711531029153|OC1pYofqsBMeAUcn-w8aljGCxWk&maxwidth=320`,
    );
    const data = await response.json();
    profileInfo = data.html;
  } catch (error) {
    console.error('Error fetching Instagram profile:', error);
  }

  return profileInfo ? (
    <div dangerouslySetInnerHTML={{ __html: profileInfo }} />
  ) : null;
};

const InstagramWidget = ({ handle }: { handle: string }) => (
  <HoverCardContent className="h-96 w-80 md:h-[30rem] md:w-96">
    <Suspense fallback={<TextSkeleton variant="p" />}>
      <InstagramWidgetContent handle={handle} />
    </Suspense>
  </HoverCardContent>
);

export default InstagramWidget;
