const { join } = require('path');

// const { createGlobPatternsForDependencies } = require('@nrwl/next/tailwind')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    join(__dirname, '{src,app,pages,components,public}/**/*!(*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
