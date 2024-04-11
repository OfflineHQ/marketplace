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
    console.log('getFont', fontFamily);
    switch (fontFamily) {
      case FontFamily.ROBOTO:
        setUiReady(true);
        return 'Roboto';
      case FontFamily.HELVETICA_NEUE:
        setUiReady(true);
        return 'Helvetica Neue';
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
      case FontFamily.NEUE_HAAS_GROTESK:
        return loadFontFamily(fontFamily, [
          {
            path: '/fonts/NeueHaasDisplay-Black.woff2',
            descriptors: { style: 'normal', weight: '900' },
          }, // font-black
          {
            path: '/fonts/NeueHaasDisplay-BlackItalic.woff2',
            descriptors: { style: 'italic', weight: '900' },
          }, // font-black
          {
            path: '/fonts/NeueHaasDisplay-Bold.woff2',
            descriptors: { style: 'normal', weight: '700' },
          }, // font-bold
          {
            path: '/fonts/NeueHaasDisplay-BoldItalic.woff2',
            descriptors: { style: 'italic', weight: '700' },
          }, // font-bold
          {
            path: '/fonts/NeueHaasDisplay-Light.woff2',
            descriptors: { style: 'normal', weight: '300' },
          }, // font-light
          {
            path: '/fonts/NeueHaasDisplay-LightItalic.woff2',
            descriptors: { style: 'italic', weight: '300' },
          }, // font-light
          {
            path: '/fonts/NeueHaasDisplay-Medium.woff2',
            descriptors: { style: 'normal', weight: '500' },
          }, // font-medium
          {
            path: '/fonts/NeueHaasDisplay-MediumItalic.woff2',
            descriptors: { style: 'italic', weight: '500' },
          }, // font-medium
          {
            path: '/fonts/NeueHaasDisplay-Thin.woff2',
            descriptors: { style: 'normal', weight: '100' },
          }, // font-thin
          {
            path: '/fonts/NeueHaasDisplay-ThinItalic.woff2',
            descriptors: { style: 'italic', weight: '100' },
          }, // font-thin
          {
            path: '/fonts/NeueHaasDisplay-XThin.woff2',
            descriptors: { style: 'normal', weight: '200' },
          }, // font-extralight
          {
            path: '/fonts/NeueHaasDisplay-XThinItalic.woff2',
            descriptors: { style: 'italic', weight: '200' },
          }, // font-extralight
          {
            path: '/fonts/NeueHaasDisplay-XXThin.woff2',
            descriptors: { style: 'normal', weight: '100' },
          }, // Adjusted to font-thin, consider if this is correct
          {
            path: '/fonts/NeueHaasDisplay-XXThinItalic.woff2',
            descriptors: { style: 'italic', weight: '100' },
          }, // Adjusted to font-thin, consider if this is correct
        ]);
      case FontFamily.INTER:
        return loadFontFamily(fontFamily, [
          {
            path: '/fonts/Inter-VariableFont_slnt,wght.woff2',
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
          `${getFont(fontFamily)}, -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
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
