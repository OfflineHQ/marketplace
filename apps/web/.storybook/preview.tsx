import './globals.css';
import { Inter } from '@next/font/google';
import { Preview } from '@storybook/react';
import { cn } from '@ui/shared';
import { rootLayoutClasses, parameters } from '../../../storybook.preview.base';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

document.body.classList.add(fontSans.variable);
document.body.classList.add('font-sans');

const preview: Preview = {
  decorators: [
    // Root layout classes for all stories
    (Story) => (
      <div className={cn(rootLayoutClasses)}>
        <Story />
      </div>
    ),
  ],
  parameters,
};
export default preview;

// import * as NextImage from 'next/image';

// const OriginalNextImage = NextImage.default;

// Object.defineProperty(NextImage, 'default', {
//   configurable: true,
//   value: (props) =>
//     typeof props.src === 'string' ? (
//       <OriginalNextImage {...props} unoptimized blurDataURL={props.src} />
//     ) : (
//       <OriginalNextImage {...props} unoptimized />
//     ),
// });

// Object.defineProperty(NextImage, '__esModule', {
//   configurable: true,
//   value: true,
// });
