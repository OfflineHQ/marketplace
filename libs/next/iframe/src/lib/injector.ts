'use client';

import 'iframe-resizer/js/iframeResizer.contentWindow';
import { useEffect } from 'react';

interface IFrameResizerProps {
  onLoaded: () => void;
}

const IFrameResizer: React.FC<IFrameResizerProps> = ({ onLoaded }) => {
  useEffect(() => {
    onLoaded();
  }, []);
  return null;
};

export default IFrameResizer;
