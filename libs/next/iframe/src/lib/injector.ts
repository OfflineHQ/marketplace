'use client';

import { IFramePage } from 'iframe-resizer';
import { useEffect, useRef } from 'react';

interface IFrameResizerProps {
  onMessage: (message: any) => void;
  onReady: (iframeParent: IFramePage) => void;
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
        onReady: () => {
          onReady((window as any).parentIFrame);
        },
      };
      console.log(
        'IFrameResizer injected',
        (window as any).iFrameResizer,
        (window as any).parentIFrame,
      );
      onReady((window as any).parentIFrame);
    };

    if (!window) {
      console.log('Window not found');
      return;
    }

    if (!(window as any).iFrameResizer) {
      loadIFrameResizer();
    } else {
      setIFrameResizer();
    }
  }, []);

  return null;
};

export default IFrameResizer;
