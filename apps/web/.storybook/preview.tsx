import { Preview } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import {
  DarkModeDecorator,
  I18nextStoryDecorator,
  localStorageResetDecorator,
  mockDateDecorator,
} from '../../../storybook/storybook.nextjs.decorators';
import { parameters } from '../../../storybook/storybook.preview.base';
import '../styles/globals.css';

// Initialize MSW
initialize();
window.STORYBOOK_ENV = true;
// Create a global variable called locale in storybook
// and add a dropdown in the toolbar to change your locale
export const globalTypes = {
  locale: {
    defaultValue: 'en',
    name: 'Locale',
    description: 'Internationalization locale',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', right: '🇺🇸', title: 'English' },
        { value: 'fr', right: '🇫🇷', title: 'Francais' },
      ],
      showName: true,
    },
  },
};

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters: {
    ...parameters,
    nextjs: {
      appDirectory: true,
    },
  },
  decorators: [
    mockDateDecorator,
    DarkModeDecorator,
    I18nextStoryDecorator,
    localStorageResetDecorator,
  ],
  // Provide the MSW addon loader globally
  loaders: [mswLoader],
};
export default preview;
