'use server';

import { HoverCardContent, TextSkeleton } from '@ui/components';
import { Suspense } from 'react';

const TwitterWidgetContent = async ({ handle }: { handle: string }) => {
  let profileInfo = '';
  try {
    const response = await fetch(
      `https://publish.twitter.com/oembed?url=https%3A%2F%2Ftwitter.com%2F${handle}`,
    );
    const data = await response.json();
    profileInfo = data.html;
  } catch (error) {
    console.error('Error fetching Twitter profile:', error);
  }

  return profileInfo ? (
    <div dangerouslySetInnerHTML={{ __html: profileInfo }} />
  ) : null;
};

const TwitterWidget = ({ handle }: { handle: string }) => (
  <HoverCardContent className="h-96 w-80 md:h-[30rem] md:w-96">
    <Suspense fallback={<TextSkeleton variant="p" />}>
      <TwitterWidgetContent handle={handle} />
    </Suspense>
  </HoverCardContent>
);

export default TwitterWidget;
