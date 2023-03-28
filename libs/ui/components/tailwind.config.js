const { join } = require('path');

const baseConfig = require('../../../tailwind.config.base');

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [join(__dirname, '../../ui/**/!(*.spec).{ts,tsx}')],
  ...baseConfig,
};
