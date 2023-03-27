import './globals.css';
import { withTailwindTheme } from './withTailwindTheme.decorator';
import { rootLayout } from './rootLayout.decorator';
import { themes } from '@storybook/theming';

export const parameters = {
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark, appContentBg: 'rgb(15 23 42)' },
    // Override the default light theme
    light: { ...themes.normal },
    darkClass: 'dark',
    lightClass: 'light',
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

export const decorators = [withTailwindTheme, rootLayout];
