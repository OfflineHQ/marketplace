/* eslint-disable tailwindcss/no-custom-classname */
import './globals.css';
import { useEffect } from 'react';
import { Preview, Decorator } from '@storybook/react';
import { parameters } from '../../../../storybook.preview.base';

import { useDarkMode } from 'storybook-dark-mode';

export const StoryDecorator: Decorator = (Story: any, context) => {
  const dark = useDarkMode();
  const { isDark } = context.parameters.darkMode;
  useEffect(() => {
    if (isDark) {
      // add dark class to className
      document.documentElement.classList.replace('light', 'dark');
    }
  }, [dark, isDark]);
  return <Story />;
};

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters,
  decorators: [StoryDecorator],
};

export default preview;
