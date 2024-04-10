'use client';

import { IFramePage } from 'iframe-resizer';
import dynamic from 'next/dynamic';
import { Inter, Roboto } from 'next/font/google';
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
  ReceiveMessageValues,
} from './types';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-sans',
});

const roboto = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-sans',
});

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

  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<string>('');
  const [fontFamily, setFontFamily] = useState<string | null>(null);

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

    switch (type) {
      case ReceiveMessageType.CONNECT_STATUS:
        // Handle the wallet connect URI message
        console.log('CONNECT_STATUS', value);
        setConnectStatus(
          (value as ReceiveMessageValues[ReceiveMessageType.CONNECT_STATUS])
            .status,
        );
        break;
      case ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES:
        // Handle the update CSS variables message
        console.log('UPDATE_CSS_VARIABLES_AND_CLASSES', value);
        setCssVariables(
          (
            value as ReceiveMessageValues[ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES]
          ).cssVariables,
        );
        setClasses(
          (
            value as ReceiveMessageValues[ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES]
          ).classes,
        );
        setFontFamily(
          (
            value as ReceiveMessageValues[ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES]
          ).fontFamily,
        );
        break;
      // Additional message types can be handled here as needed
    }
  }

  // Determine the font variable based on the fontFamily
  let fontVariable = '';
  switch (fontFamily) {
    case 'Helvetica':
      // fontVariable = helvetica.variable;
      break;
    case 'Roboto':
      fontVariable = roboto.variable;
      break;
    default:
      fontVariable = inter.variable;
  }

  return (
    <>
      <IFrameResizer onReady={onReadyHandler} onMessage={onMessageHandler} />
      <IFrameContext.Provider
        value={{ iframeParent, connectStatus, setConnectStatus }}
      >
        <div
          className={`off-iframe h-full bg-transparent font-sans antialiased ${classes} ${fontVariable}`}
          style={cssVariables}
        >
          {children}
        </div>
      </IFrameContext.Provider>
    </>
  );
};
