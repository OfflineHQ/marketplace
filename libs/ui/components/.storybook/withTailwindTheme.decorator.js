/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect } from 'react';
import { useDarkMode } from 'storybook-dark-mode';

export const withTailwindTheme = (Story) => {
  const isDarkMode = useDarkMode();
  useEffect(() => {
    const htmlTag = document.documentElement;
    // Set the "data-theme" attribute on the iFrame html tag
    htmlTag.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    htmlTag.setAttribute('class', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  return <Story />;
};
