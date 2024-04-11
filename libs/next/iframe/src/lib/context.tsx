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

  function loadFontFamily(
    fontFamily: string,
    fontVariations: {
      path: string;
      descriptors?: FontFaceDescriptors;
    }[],
  ) {
    const fontPromises = fontVariations.map((variation) =>
      new FontFace(
        fontFamily,
        `url(${variation.path})`,
        variation.descriptors,
      ).load(),
    );

    Promise.all(fontPromises)
      .then((fonts) => {
        fonts.forEach((font) => {
          // @ts-expect-error
          document.fonts.add(font);
        });
        setUiReady(true);
      })
      .catch((error) => {
        console.error(`Error loading ${fontFamily} fonts`, error);
      });
    return fontFamily;
  }

  function getFont(fontFamily: FontFamily) {
    switch (fontFamily) {
      case FontFamily.OPEN_SANS:
        return loadFontFamily(fontFamily, [
          {
            path: '/fonts/OpenSans-VariableFont_wdth,wght.woff2',
            descriptors: {
              style: 'normal',
            },
          },
          {
            path: '/fonts/OpenSans-Italic-VariableFont_wdth,wght.woff2',
            descriptors: {
              style: 'italic',
            },
          },
        ]);
      case FontFamily.ROBOTO:
        return loadFontFamily('Roboto', [
          {
            path: '/fonts/Roboto-Black.woff2',
            descriptors: {
              style: 'normal',
              weight: '900',
            },
          },
          {
            path: '/fonts/Roboto-BlackItalic.woff2',
            descriptors: {
              style: 'italic',
              weight: '900',
            },
          },
          {
            path: '/fonts/Roboto-Bold.woff2',
            descriptors: {
              style: 'normal',
              weight: 'bold',
            },
          },
          {
            path: '/fonts/Roboto-BoldItalic.woff2',
            descriptors: {
              style: 'italic',
              weight: 'bold',
            },
          },
          {
            path: '/fonts/Roboto-Italic.woff2',
            descriptors: {
              style: 'italic',
              weight: 'normal',
            },
          },
          {
            path: '/fonts/Roboto-Light.woff2',
            descriptors: {
              style: 'normal',
              weight: '300',
            },
          },
          {
            path: '/fonts/Roboto-LightItalic.woff2',
            descriptors: {
              style: 'italic',
              weight: '300',
            },
          },
          {
            path: '/fonts/Roboto-Medium.woff2',
            descriptors: {
              style: 'normal',
              weight: '500',
            },
          },
          {
            path: '/fonts/Roboto-MediumItalic.woff2',
            descriptors: {
              style: 'italic',
              weight: '500',
            },
          },
          {
            path: '/fonts/Roboto-Regular.woff2',
            descriptors: {
              style: 'normal',
              weight: 'normal',
            },
          },
          {
            path: '/fonts/Roboto-Thin.woff2',
            descriptors: {
              style: 'normal',
              weight: '100',
            },
          },
          {
            path: '/fonts/Roboto-ThinItalic.woff2',
            descriptors: {
              style: 'italic',
              weight: '100',
            },
          },
        ]);
      case FontFamily.INTER:
        return loadFontFamily(fontFamily, [
          {
            path: '/fonts/Inter-VariableFont_slnt,wght.woff2',
          },
        ]);
      case FontFamily.HELVETICA_NEUE:
        return loadFontFamily('Helvetica Neue', [
          {
            path: '/fonts/HelveticaNeue.woff2',
            descriptors: {
              style: 'normal',
            },
          },
          {
            path: '/fonts/HelveticaNeue-Bold.woff2',
            descriptors: {
              style: 'normal',
              weight: 'bold',
            },
          },
          {
            path: '/fonts/HelveticaNeue-Italic.woff2',
            descriptors: {
              style: 'italic',
            },
          },
          {
            path: '/fonts/HelveticaNeue-Light.woff2',
            descriptors: {
              style: 'normal',
              weight: '300',
            },
          },
          {
            path: '/fonts/HelveticaNeue-Medium.woff2',
            descriptors: {
              style: 'normal',
              weight: '500',
            },
          },
          {
            path: '/fonts/HelveticaNeue-Thin.woff2',
            descriptors: {
              style: 'normal',
              weight: '100',
            },
          },
          {
            path: '/fonts/HelveticaNeueRegular.woff2',
            descriptors: {
              style: 'normal',
            },
          },
        ]);
      default:
        console.error(`Font family ${fontFamily} not found`);
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
        cssVariables['--font-family'] =
          `${getFont(fontFamily)}, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
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
