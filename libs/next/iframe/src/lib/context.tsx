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
import { getFont } from './fontUtils';
import {
  ConnectStatus,
  IFrameParentMessage,
  OffKeyState,
  ReceiveMessageType,
  ReceiveMessageValues,
} from './types';

interface IFrameContextType {
  iframeParent: IFramePage | null;
  connectStatus: ConnectStatus | null;
  uiReady: boolean;
  offKeyState: OffKeyState | null;
  setConnectStatus: Dispatch<SetStateAction<ConnectStatus | null>>;
  customer: ReceiveMessageValues[ReceiveMessageType.CUSTOMER] | null;
  linkedCustomer:
    | ReceiveMessageValues[ReceiveMessageType.LINKED_CUSTOMER]
    | null;
}

const defaultState: IFrameContextType = {
  iframeParent: null,
  connectStatus: null,
  setConnectStatus: () => null,
  uiReady: false,
  offKeyState: null,
  customer: null,
  linkedCustomer: null,
};

const IFrameContext = createContext<IFrameContextType>(defaultState);

const IFrameResizer = dynamic(() => import('./injector'), {
  ssr: false,
});

export const useIFrame = () => useContext(IFrameContext);

interface IFrameProviderProps {
  children: ReactNode;
}

export const IFrameProvider: React.FC<IFrameProviderProps> = ({ children }) => {
  const [iframeParent, setIFrameParent] =
    useState<IFrameContextType['iframeParent']>(null);
  const [connectStatus, setConnectStatus] =
    useState<IFrameContextType['connectStatus']>(null);
  const [offKeyState, setOffKeyState] =
    useState<IFrameContextType['offKeyState']>(null);

  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<string>('');
  const [uiReady, setUiReady] = useState(false);
  const [customer, setCustomer] = useState<IFrameContextType['customer']>(null);
  const [linkedCustomer, setLinkedCustomer] =
    useState<IFrameContextType['linkedCustomer']>(null);

  const handleIFrameReady = () => {
    setIFrameParent((window as any).parentIFrame);
  };

  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/events.md
  const handleIFrameMessage = <T extends ReceiveMessageType>({
    type,
    value,
  }: IFrameParentMessage<T>) => {
    switch (type) {
      case ReceiveMessageType.CONNECT_STATUS:
        setConnectStatus(
          (value as ReceiveMessageValues[ReceiveMessageType.CONNECT_STATUS])
            .status,
        );
        break;
      case ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES:
        // eslint-disable-next-line no-case-declarations
        const { cssVariables, classes, fontFamily } =
          value as ReceiveMessageValues[ReceiveMessageType.UPDATE_CSS_VARIABLES_AND_CLASSES];
        cssVariables['--font-family'] =
          `${getFont(fontFamily, () => setUiReady(true))}, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
        setCssVariables(cssVariables);
        setClasses(`${classes} font-${fontFamily}`);
        break;
      case ReceiveMessageType.OFF_KEY_STATE:
        setOffKeyState(
          (value as ReceiveMessageValues[ReceiveMessageType.OFF_KEY_STATE])
            .status,
        );
        break;
      case ReceiveMessageType.CUSTOMER:
        setCustomer(value as ReceiveMessageValues[ReceiveMessageType.CUSTOMER]);
        break;
      case ReceiveMessageType.LINKED_CUSTOMER:
        setLinkedCustomer(
          value as ReceiveMessageValues[ReceiveMessageType.LINKED_CUSTOMER],
        );
        break;
    }
  };
  return (
    <>
      <IFrameResizer
        onReady={handleIFrameReady}
        onMessage={handleIFrameMessage}
      />
      <IFrameContext.Provider
        value={{
          iframeParent,
          connectStatus,
          setConnectStatus,
          uiReady,
          offKeyState,
          customer,
          linkedCustomer,
        }}
      >
        <div
          className={`off-iframe h-full bg-transparent antialiased ${classes}`}
          style={cssVariables}
        >
          {children}
        </div>
      </IFrameContext.Provider>
    </>
  );
};
