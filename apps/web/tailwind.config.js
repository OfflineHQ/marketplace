const { join } = require('path');
const baseConfig = require('../../tailwind.config.base');

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
  ...baseConfig,
};
