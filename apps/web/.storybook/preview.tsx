import '../styles/globals.css';
import { Inter } from '@next/font/google';
import { Preview } from '@storybook/react';
import { parameters } from '../../../storybook.preview.base';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

document.body.classList.add(fontSans.variable);
document.body.classList.add('font-sans');

const preview: Preview = {
  parameters,
};
export default preview;
