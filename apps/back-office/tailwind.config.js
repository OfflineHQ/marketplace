const { join } = require('path');
const baseConfig = require('../../tailwind.config.base');

const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');
/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,app,pages,components,public}/**/!(*.spec).{ts,tsx,html}'
    ),
    join(__dirname, '../../libs/features/**/!(*.spec).{ts,tsx}'),
    join(__dirname, '../../libs/next/hygraph/**/!(*.spec).{ts,tsx}'),
    join(__dirname, '../../libs/next/date/**/!(*.spec).{ts,tsx}'),
    join(__dirname, '../../libs/ui/**/!(*.spec).{ts,tsx}'),
  ],
  ...baseConfig,
};
