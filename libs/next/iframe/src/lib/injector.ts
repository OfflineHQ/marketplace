'use client';

import '@iframe-resizer/child';
import { useEffect } from 'react';

interface IFrameResizerProps {
  onLoaded: () => void;
  onMessage: (message: any) => void;
  onReady: () => void;
}

const IFrameResizer: React.FC<IFrameResizerProps> = ({
  onLoaded,
  onMessage,
  onReady,
}) => {
  useEffect(() => {
    onLoaded();
    (window as any).iFrameResizer = {
      targetOrigin: '*',
      onMessage,
      onReady,
    };
  }, []);
  return null;
};

export default IFrameResizer;
