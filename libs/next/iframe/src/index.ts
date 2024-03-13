'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isServerSide } from '@utils';
import { IFramePage } from 'iframe-resizer';
import { useEffect } from 'react';

export const useParentIFrame = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<IFramePage>(['parentIFrame']);
};

enum MessageType {
  WALLET_CONNECT_URI = 'WALLET_CONNECT_URI',
  // Additional message types can be added here as needed
}

interface MessageValues {
  [MessageType.WALLET_CONNECT_URI]: { wcUri: string };
  // Additional value shapes can be defined here corresponding to the MessageType
}

interface IFrameParentMessage<T extends MessageType> {
  type: T;
  value: MessageValues[T];
}

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
  function onMessageHandler({ type, value }: IFrameParentMessage) {
    console.log('message from parent', { type, value });
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case MessageType.WALLET_CONNECT_URI:
        // Handle the wallet connect URI message
        console.log('setting wallet connect uri', value.wcUri);
        queryClient.setQueryData(['walletConnectUri'], value.wcUri);
        break;
      // Additional message types can be handled here as needed
    }
  }

  async function initializeIframeResizer() {
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
