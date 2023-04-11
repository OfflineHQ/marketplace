import './globals.css';
import { Preview } from '@storybook/react';
import { parameters } from '../../../../storybook.preview.base';

document.body.classList.add('font-sans');

const preview: Preview = {
  parameters,
};

export default preview;
