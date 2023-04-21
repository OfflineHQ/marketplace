/* eslint-disable tailwindcss/no-custom-classname */
import './globals.css';
import { useEffect, useState } from 'react';
import { Preview, Decorator } from '@storybook/react';
import { parameters } from '../../../../storybook.preview.base';

// // can't take it from storybook.preview.base otherwise buggy
export const DarkModeDecorator: Decorator = (Story: any, context: any = {}) => {
  const [dark, setDark] = useState(false);
  const { isDark } = context.parameters.darkMode;

  useEffect(() => {
    setDark(isDark);
    document.documentElement.classList.add('light');
    if (isDark) {
      document.documentElement.classList.replace('light', 'dark');
    }
  }, [dark, isDark]);

  return dark ? <Story key={dark} /> : <Story />;
};

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters: {
    ...parameters,
    chromatic: {
      // want to test for each ui component mobile and desktop
      viewports: [320, 1200],
    },
  },
  decorators: [DarkModeDecorator],
};

export default preview;
