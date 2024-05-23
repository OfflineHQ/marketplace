'use client';

import { useEffect, useRef } from 'react';

interface IFrameResizerProps {
  onMessage: (message: any) => void;
  onReady: () => void;
}

const IFrameResizer: React.FC<IFrameResizerProps> = ({
  onMessage,
  onReady,
}) => {
  const iFrameResizerRef = useRef(false);
  useEffect(() => {
    const loadIFrameResizer = async () => {
      console.log('Loading IFrameResizer');
      await import('@iframe-resizer/child');
      setIFrameResizer();
      iFrameResizerRef.current = true;
    };
    const setIFrameResizer = () => {
      (window as any).iFrameResizer = {
        targetOrigin: '*',
        onMessage: (message: any) => {
          console.log('IFrameResizer message', message);
          onMessage(message);
        },
        onReady,
      };
      console.log('IFrameResizer injected');
      onReady();
    };

    if (!(window as any).iFrameResizer) {
      loadIFrameResizer();
    } else {
      setIFrameResizer();
    }
  }, [onMessage, onReady]);

  return null;
};

export default IFrameResizer;
