'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { isServerSide } from '@utils';
import { IFramePage } from 'iframe-resizer';
import { useEffect } from 'react';
import { ReceiveMessageType, ReceiveMessageValues } from './types';

export interface IFrameParentMessage<T extends ReceiveMessageType> {
  type: T;
  value: ReceiveMessageValues[T];
}

export const IFrameResizer: React.FC = () => {
  const queryClient = useQueryClient();
  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/methods.md
  function onReadyHandler() {
    console.log('iframe parent ready');
    queryClient.setQueryData<IFramePage>(
      ['parentIFrame'],
      (window as any).parentIFrame,
    );
  }
  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/events.md
  function onMessageHandler<T extends ReceiveMessageType>({
    type,
    value,
  }: IFrameParentMessage<T>) {
    console.log('message from parent', { type, value });
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (type) {
      case ReceiveMessageType.CONNECT_STATUS:
        // Handle the wallet connect URI message
        console.log('setting wallet connect uri', value.address, value.status);
        queryClient.setQueryData(
          [ReceiveMessageType.CONNECT_STATUS, value.address],
          value.status,
        );
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
