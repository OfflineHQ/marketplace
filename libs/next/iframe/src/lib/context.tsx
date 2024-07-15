'use client';

import { IFramePage } from 'iframe-resizer';
import dynamic from 'next/dynamic';
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getFont } from './fontUtils';
import {
  ConnectStatus,
  IFrameParentMessage,
  OffKeyState,
  ReceiveMessageType,
  ReceiveMessageValues,
  SendMessageType,
} from './types';

interface IFrameContextType<T = unknown> {
  iframeParent: IFramePage | null;
  connectStatus: ConnectStatus | null;
  uiReady: boolean;
  offKeyState: OffKeyState | null;
  setConnectStatus: Dispatch<SetStateAction<ConnectStatus | null>>;
  customer: ReceiveMessageValues[ReceiveMessageType.CUSTOMER] | null;
  linkedCustomer:
    | ReceiveMessageValues[ReceiveMessageType.LINKED_CUSTOMER]
    | null;
  product: ReceiveMessageValues[ReceiveMessageType.PRODUCT] | null;
  additionalData: T | null;
}

const defaultState: IFrameContextType = {
  iframeParent: null,
  connectStatus: null,
  setConnectStatus: () => null,
  uiReady: false,
  offKeyState: null,
  customer: null,
  linkedCustomer: null,
  product: null,
  additionalData: null,
};

const IFrameContext = createContext<IFrameContextType<unknown>>(defaultState);

const IFrameResizer = dynamic(() => import('./injector'), {
  ssr: false,
});

export function useIFrame<T>() {
  return useContext(IFrameContext) as IFrameContextType<T>;
}

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
  const [product, setProduct] = useState<IFrameContextType['product']>(null);
  const [additionalData, setAdditionalData] = useState<unknown>(null);

  // https://github.com/davidjbradshaw/iframe-resizer/blob/master/docs/iframed_page/events.md
  const handleIFrameMessage = useCallback(
    <T extends ReceiveMessageType>({ type, value }: IFrameParentMessage<T>) => {
      switch (type) {
        case ReceiveMessageType.ALL:
          console.log('Received ALL message', value);
          // eslint-disable-next-line no-case-declarations
          const {
            offKeyState,
            connectStatus,
            cssVariablesAndClasses,
            customer,
            linkedCustomer,
            product,
          } = value as ReceiveMessageValues[ReceiveMessageType.ALL];
          if (connectStatus) {
            setConnectStatus(connectStatus.status);
          }
          if (offKeyState) {
            setOffKeyState(offKeyState.status);
          }
          if (cssVariablesAndClasses) {
            // eslint-disable-next-line no-case-declarations
            const { cssVariables, classes, fontFamily } =
              cssVariablesAndClasses;
            cssVariables['--font-family'] =
              `${getFont(fontFamily, () => setUiReady(true))}, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
            setCssVariables(cssVariables);
            setClasses(`${classes} font-${fontFamily}`);
          }
          if (customer) {
            setCustomer(customer);
          }
          if (linkedCustomer) {
            setLinkedCustomer(linkedCustomer);
          }
          if (product) {
            setProduct(product);
          }
          if ('additionalData' in value) {
            setAdditionalData(value.additionalData);
          }
          break;
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
          setCustomer(
            value as ReceiveMessageValues[ReceiveMessageType.CUSTOMER],
          );
          break;
        case ReceiveMessageType.LINKED_CUSTOMER:
          setLinkedCustomer(
            value as ReceiveMessageValues[ReceiveMessageType.LINKED_CUSTOMER],
          );
          break;
        case ReceiveMessageType.PRODUCT:
          setProduct(value as ReceiveMessageValues[ReceiveMessageType.PRODUCT]);
          break;
      }
    },
    [],
  );

  const onMessageRef = useRef(handleIFrameMessage);

  const handleIFrameReady = (iframeParent?: IFramePage) => {
    console.log('IFrame parent ready, ', iframeParent);
    if (iframeParent) {
      setIFrameParent(iframeParent);
      iframeParent.sendMessage({ type: SendMessageType.READY });
    } else if ((window as any).parentIFrame) {
      setIFrameParent((window as any).parentIFrame);
      (window as any).parentIFrame.sendMessage({ type: SendMessageType.READY });
    }
  };
  const onReadyRef = useRef(handleIFrameReady);

  useEffect(() => {
    onMessageRef.current = handleIFrameMessage;
  }, [handleIFrameMessage]);

  return (
    <>
      <IFrameResizer
        onMessage={onMessageRef.current}
        onReady={onReadyRef.current}
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
          product,
          additionalData,
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
