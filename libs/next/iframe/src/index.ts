'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isServerSide } from '@utils';
import { IFramePage } from 'iframe-resizer';
import { useEffect } from 'react';

export const useParentIFrame = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<IFramePage>(['parentIFrame']);
};

const IFrameResizer: React.FC = () => {
  const queryClient = useQueryClient();
  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/methods.md
  function onReadyHandler() {
    queryClient.setQueryData<IFramePage>(
      ['parentIFrame'],
      (window as any).parentIFrame,
    );
  }
  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/events.md
  function onMessageHandler(message: any) {
    console.log('message from parent', message);
  }

  function initializeIframeResizer() {
    // Proceed with dynamic import and setup
    // @ts-expect-error
    return import('iframe-resizer/js/iframeResizer.contentWindow').then(() => {
      (window as any).iFrameResizer = {
        log: true,
        onReady: onReadyHandler,
        onMessage: onMessageHandler,
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
  return null;
};

export default IFrameResizer;
