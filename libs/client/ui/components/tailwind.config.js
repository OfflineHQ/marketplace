const { join } = require('path');

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,tsx}')],
  darkMode: 'class',
  theme: {
    extend: {},
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
