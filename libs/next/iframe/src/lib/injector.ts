'use client';

import 'iframe-resizer/js/iframeResizer.contentWindow';
import { useEffect } from 'react';
import { IFrameParentMessage, ReceiveMessageType } from './types';

interface IFrameResizerProps {
  onReady: () => void;
  onMessage: <T extends ReceiveMessageType>(
    message: IFrameParentMessage<T>,
  ) => void;
}

const IFrameResizer: React.FC<IFrameResizerProps> = ({
  onReady,
  onMessage,
}) => {
  /* async function initializeIframeResizer() {
     // Proceed with dynamic import and setup
     // @ts-ignore
     return import('iframe-resizer/js/iframeResizer.contentWindow').then(() => {
       (window as any).iFrameResizer = {
         log: true,
         onReady,
         onMessage,
       };
       // Return the initialized iFrameResizer object
       return Promise.resolve((window as any).iFrameResizer);
     });
   }

   const { mutate, status } = useMutation({
     mutationFn: initializeIframeResizer,
     onSuccess: (props: any) => {
       console.log('mutation success', props);
     },
     onError: (error) => {
       console.log('mutation error', error);
     },
   });

   useEffect(() => {
     if (!isServerSide() && status === 'idle') {
       mutate();
     }
   }, [status, mutate]);
   return null; */

  useEffect(() => {
    (window as any).iFrameResizer = {
      onMessage,
      onReady,
    };
    console.log('iFrameResizer initialized:', (window as any).iFrameResizer);
  }, []);
  return null;
};

export default IFrameResizer;
