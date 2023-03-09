const { join } = require('path');

// const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  // content: [
  //   // look for source files in the app folder
  //   join(__dirname, 'app/**/*.{ts,tsx,html}'),
  //   // but then also look for source files in all the libs that the app depends on
  //   ...createGlobPatternsForDependenciesLocal(__dirname),
  // ],
  content: [
    './node_modules/flowbite-react/**/*.js',
    join(
      __dirname,
      '{src,app,pages,components,public}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('flowbite/plugin'), require('flowbite-typography')],
};
