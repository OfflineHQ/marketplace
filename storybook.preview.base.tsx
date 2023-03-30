export const rootLayoutClasses =
  'min-h-screen bg-transparent font-sans text-slate-900 dark:bg-slate-900 antialiased dark:text-slate-50';

export const parameters = {
  darkMode: {
    darkClass: 'dark',
    lightClass: 'light',
    classTarget: 'html',
    stylePreview: true,
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
  chromatic: {
    viewports: [320, 1200],
  },
};
