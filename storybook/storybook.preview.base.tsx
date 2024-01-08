export const parameters = {
  darkMode: {
    darkClass: 'dark',
    lightClass: 'light',
    classTarget: 'html',
    stylePreview: true,
  },
  viewport: {
    viewports: {
      small_mobile: {
        name: 'Small Mobile',
        styles: { width: '320px', height: '568px' },
      },
      large_mobile: {
        name: 'Large Mobile',
        styles: { width: '414px', height: '896px' },
      },
      desktop: {
        name: 'Desktop',
        styles: { width: '1366px', height: '768px' },
      },
    },
  },
  backgrounds: {
    disable: true,
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
