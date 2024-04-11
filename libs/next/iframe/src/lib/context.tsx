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
  FontFamily,
  IFrameParentMessage,
  ReceiveMessageType,
  ReceiveMessageValues,
} from './types';

interface IFrameContextType {
  iframeParent: IFramePage | null;
  connectStatus: ConnectStatus | null;
  uiReady: boolean;
  setConnectStatus: Dispatch<SetStateAction<ConnectStatus | null>>;
}

const defaultState: IFrameContextType = {
  iframeParent: null,
  connectStatus: null,
  setConnectStatus: () => {},
  uiReady: false,
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
  const [iframeParent, setIFrameParent] = useState<IFramePage | null>(null);
  const [connectStatus, setConnectStatus] = useState<ConnectStatus | null>(
    null,
  );

  const [cssVariables, setCssVariables] = useState<Record<string, string>>({});
  const [classes, setClasses] = useState<string>('');
  const [uiReady, setUiReady] = useState(false);

  const handleIFrameReady = () => {
    setIFrameParent((window as any).parentIFrame);
  };

  function getFont(fontFamily: FontFamily) {
    switch (fontFamily) {
      case FontFamily.OPEN_SANS:
        // Load local Open Sans font files
        Promise.all([
          new FontFace(
            fontFamily,
            `url(/fonts/OpenSans-VariableFont_wdth,wght.ttf)`,
            { style: 'normal' },
          ).load(),
          new FontFace(
            fontFamily,
            `url(/fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf)`,
            { style: 'italic' },
          ).load(),
        ])
          .then((fonts) => {
            fonts.forEach((font) => {
              // @ts-expect-error
              document.fonts.add(font);
            });
            setUiReady(true);
          })
          .catch((error) => {
            console.error('Error loading Open Sans fonts', error);
          });

        return fontFamily; // Return the font family name to be used in CSS
      case FontFamily.ROBOTO:
        // Similar approach for Roboto or any other local fonts
        break;
      case FontFamily.INTER:
        // INTER is already used by default, no action needed
        return '';
      // Add more cases as needed
      default:
        return '';
    }
  }
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
        console.log('fontFamily', fontFamily);
        if (fontFamily !== FontFamily.INTER) {
          const font = getFont(fontFamily);
          if (font) {
            cssVariables['--font-family'] =
              `${font}, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
          }
        }
        setCssVariables(cssVariables);
        setClasses(`${classes} font-${fontFamily}`);
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
        value={{ iframeParent, connectStatus, setConnectStatus, uiReady }}
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
