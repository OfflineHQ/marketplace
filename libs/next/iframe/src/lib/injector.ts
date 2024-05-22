'use client';

import '@iframe-resizer/child';
import { useEffect } from 'react';

interface IFrameResizerProps {
  onMessage: (message: any) => void;
  onReady: () => void;
}

const IFrameResizer: React.FC<IFrameResizerProps> = ({
  onMessage,
  onReady,
}) => {
  useEffect(() => {
    (window as any).iFrameResizer = {
      targetOrigin: '*', // Default value, don't restrict to allow any shopify domain
      onMessage,
      onReady,
    };
    console.log('IFrameResizer injected');
  }, []);
  return null;
};

export default IFrameResizer;
