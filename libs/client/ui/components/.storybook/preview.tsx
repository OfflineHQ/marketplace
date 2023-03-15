import './globals.css';
import { DEFAULT_THEME, withTailwindTheme } from './withTailwindTheme.decorator';
import { themes } from '@storybook/theming';

// export const globalTypes = {
//   theme: {
//     name: 'Theme',
//     description: 'Global theme for components',
//     defaultValue: DEFAULT_THEME,
//     toolbar: {
//       icon: 'paintbrush',
//       // Array of plain string values or MenuItem shape (see below)
//       items: [
//         { value: 'light', title: 'Light', left: '🌞' },
//         { value: 'dark', title: 'Dark', left: '🌛' },
//       ],
//       // Change title based on selected value
//       dynamicTitle: true,
//     },
//   },
// };

export const parameters = {
  darkMode: {
    // Override the default dark theme
    dark: { ...themes.dark },
    // Override the default light theme
    light: { ...themes.normal },
    darkClass: 'dark',
    lightClass: 'light',
  },
  background: {
    disable: true,
  },
};

export const decorators = [withTailwindTheme];
