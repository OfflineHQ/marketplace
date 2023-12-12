'use server';

import { HoverCardContent, TextSkeleton } from '@ui/components';
import { Suspense } from 'react';

const TikTokWidgetContent = async ({ handle }: { handle: string }) => {
  let profileInfo = '';
  try {
    const response = await fetch(
      `https://www.tiktok.com/oembed?url=https://www.tiktok.com/@${handle}`,
    );
    const data = await response.json();
    profileInfo = data.html;
  } catch (error) {
    console.error('Error fetching TikTok profile:', error);
  }

  return profileInfo ? (
    <div dangerouslySetInnerHTML={{ __html: profileInfo }} />
  ) : null;
};

const TikTokWidget = ({ handle }: { handle: string }) => (
  <HoverCardContent className="h-96 w-80 md:h-[30rem] md:w-96">
    <Suspense fallback={<TextSkeleton variant="p" />}>
      <TikTokWidgetContent handle={handle} />
    </Suspense>
  </HoverCardContent>
);

export default TikTokWidget;
