'use client';
import { isServerSide } from '@utils';
import { useEffect, useState } from 'react';

const IFrameResizer: React.FC = () => {
  const [iframeResizerInstance, setIframeResizerInstance] = useState(null);
  const [isReady, setIsReady] = useState(false); // Initialize isReady state

  function onReadyHandler() {
    console.log('iframeResizer contentWindow provider is ready');
    const myId = (window as any).parentIFrame.getId();
    console.log('The ID of the iFrame in the parent page is: ' + myId);
    setIsReady(true); // Set isReady to true when initialized
  }

  function onMessageHandler(message: any) {
    console.log('message from parent', message);
  }

  useEffect(() => {
    if (!iframeResizerInstance && !isServerSide()) {
      (window as any).iFrameResizer = {
        log: true,
        onReady: onReadyHandler,
        onMessage: onMessageHandler,
      };
      setIframeResizerInstance((window as any).iFrameResizer);
    }
    // @ts-expect-error
    import('iframe-resizer/js/iframeResizer.contentWindow');
  }, [iframeResizerInstance]);
  return null;
};

export default IFrameResizer;
