const { join } = require('path');

const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    './node_modules/flowbite-react/**/*.js',
    join(__dirname, '{src}/**/!(*.stories|*.spec).{ts,tsx}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class', // or 'media' or 'class'
  // https://flowbite.com/docs/customize/theming/
  theme: {
    extend: {},
    // screens: {
    //   sm: '480px',
    //   md: '768px',
    //   lg: '976px',
    //   xl: '1440px',
    // },
  },
  variants: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('flowbite-typography')],
};
