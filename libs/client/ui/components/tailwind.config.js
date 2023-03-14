const { join } = require('path');

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,tsx}')],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
