'use client';

import { IFramePage } from 'iframe-resizer';
import dynamic from 'next/dynamic';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import {
  ConnectStatus,
  IFrameParentMessage,
  ReceiveMessageType,
} from './types';

interface IFrameContextType {
  iframeParent: IFramePage | null;
  connectStatus: ConnectStatus | null;
  setConnectStatus: Dispatch<SetStateAction<ConnectStatus | null>>;
}

const defaultState: IFrameContextType = {
  iframeParent: null,
  connectStatus: null,
  setConnectStatus: () => {},
};

const IFrameContext = createContext<IFrameContextType>(defaultState);

const IFrameResizer = dynamic(() => import('./injector'), {
  ssr: false,
});

export const useIFrame = () => useContext(IFrameContext);

export const IFrameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [iframeParent, setIFrameParent] = useState<IFramePage | null>(null);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(
    null,
  );

  function onReadyHandler() {
    console.log('iframe parent ready');
    setIFrameParent((window as any).parentIFrame);
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
        console.log('CONNECT_STATUS', value.address, value.status);
        setConnectStatus(value.status);
        break;
      // Additional message types can be handled here as needed
    }
  }

  return (
    <>
      <IFrameResizer onReady={onReadyHandler} onMessage={onMessageHandler} />
      <IFrameContext.Provider
        value={{ iframeParent, connectStatus, setConnectStatus }}
      >
        {children}
      </IFrameContext.Provider>
    </>
  );
};
