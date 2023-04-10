// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const animate = require('tailwindcss-animate');

/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */

const screens = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      colors: {
        brand: {
          dark: '#020207',
          gray: '#535353',
          primary: '#FFF7E8',
          secondary: '#FF6771',
          beige: '#FFFDF8',
          yellow: '#F2C65E',
          ui: {
            primary: '#603DEB',
            secondary: '#020207',
          },
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
    screens,
  },
  variants: {
    extend: {},
  },
  plugins: [animate, typography, forms],
};
