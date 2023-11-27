'use server';

import { HoverCardContent, TextSkeleton } from '@ui/components';
import { Suspense } from 'react';

const FacebookWidgetContent = async ({ handle }: { handle: string }) => {
  let profileInfo = '';
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/oembed_page?url=https://www.facebook.com/${handle}/&access_token=YOUR-ACCESS-TOKEN&maxwidth=320`,
    );
    const data = await response.json();
    profileInfo = data.html;
  } catch (error) {
    console.error('Error fetching Facebook profile:', error);
  }

  return profileInfo ? (
    <div dangerouslySetInnerHTML={{ __html: profileInfo }} />
  ) : null;
};

const FacebookWidget = ({ handle }: { handle: string }) => (
  <HoverCardContent className="h-96 w-80 md:h-[30rem] md:w-96">
    <Suspense fallback={<TextSkeleton variant="p" />}>
      <FacebookWidgetContent handle={handle} />
    </Suspense>
  </HoverCardContent>
);

export default FacebookWidget;
