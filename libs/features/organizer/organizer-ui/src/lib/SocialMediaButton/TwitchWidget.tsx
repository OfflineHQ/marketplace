'use client';
// TwitchWidget.tsx
import { HoverCardContent } from '@ui/components';
import { useEffect, useRef } from 'react';

const TwitchWidget = ({ handle }: { handle: string }) => {
  const twitchEmbedRef = useRef(null);

  useEffect(() => {
    if (twitchEmbedRef.current) {
      const script = document.createElement('script');
      script.setAttribute('src', 'https://embed.twitch.tv/embed/v1.js');
      script.addEventListener('load', () => {
        new (window as any).Twitch.Embed(`twitch-embed-${handle}`, {
          width: '100%',
          height: '100%',
          channel: handle,
          // parent: ['localhost'], // replace with your domain
        });
      });
      document.body.appendChild(script);
    }
  }, [handle]);

  return (
    <HoverCardContent className="m-0 h-96 w-80 p-0 md:h-[30rem] md:w-96">
      <div id={`twitch-embed-${handle}`} ref={twitchEmbedRef} />
    </HoverCardContent>
  );
};

export default TwitchWidget;
