'use client';

import { isServerSide } from '@utils';
import 'iframe-resizer/js/iframeResizer.contentWindow';
import { useEffect } from 'react';

function IFrameResizer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (isServerSide()) return;
    (window as any).iFrameResizer = {
      log: true,
      onReady: function () {
        const myId = (window as any).parentIFrame.getId();
        console.log('The ID of the iFrame in the parent page is: ' + myId);
      },
      onMessage: function (message: any) {
        alert('Got message from parent');
        console.log('message from parent', message);
      },
    };
    console.log('iFrameResizer:', (window as any).iFrameResizer);
  }, []);

  return children;
}

export default IFrameResizer;
