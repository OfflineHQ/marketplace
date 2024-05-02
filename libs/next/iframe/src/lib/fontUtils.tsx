import { FontFamily } from './types';

export function loadFontFamily(
  fontFamily: string,
  fontVariations: {
    path: string;
    descriptors?: FontFaceDescriptors;
  }[],
  onFontReady: () => void,
) {
  const fontPromises = fontVariations.map((variation) =>
    new FontFace(
      fontFamily,
      `url(${variation.path})`,
      variation.descriptors,
    ).load(),
  );

  return Promise.all(fontPromises)
    .then((fonts) => {
      fonts.forEach((font) => {
        // @ts-ignore
        document.fonts.add(font);
      });
      onFontReady();
      return fontFamily;
    })
    .catch((error) => {
      console.error(`Error loading ${fontFamily} fonts`, error);
      return '';
    });
}

export function getFont(fontFamily: FontFamily, onFontReady: () => void) {
  switch (fontFamily) {
    case FontFamily.ROBOTO:
      onFontReady();
      return 'Roboto';
    case FontFamily.HELVETICA_NEUE:
      onFontReady();
      return 'Helvetica Neue';
    case FontFamily.OPEN_SANS:
      return loadFontFamily(
        fontFamily,
        [
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
        ],
        onFontReady,
      );
    case FontFamily.NEUE_HAAS_GROTESK:
      return loadFontFamily(
        fontFamily,
        [
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
            path: '/fonts/NeueHaasDisplay-Roman.woff2',
            descriptors: { style: 'normal', weight: '400' },
          }, // font-normal
          {
            path: '/fonts/NeueHaasDisplay-RomanItalic.woff2',
            descriptors: { style: 'italic', weight: '400' },
          }, // font-normal
        ],
        onFontReady,
      );
    default:
      console.error(`Font family ${fontFamily} not found`);
      return '';
  }
}
