// eslint-disable-next-line @typescript-eslint/no-var-requires
const { fontFamily } = require('tailwindcss/defaultTheme');
const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const animate = require('tailwindcss-animate');
const gradients = require('tailwindcss-gradients');
const plugin = require('tailwindcss/plugin');

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
  // prefix: 'off-', // avoid conflicts with other website css class names
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: {
          DEFAULT: 'hsl(var(--input))',
          distinct: 'hsl(var(--input-distinct))',
        },
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          border: 'hsl(var(--info-border))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
          border: 'hsl(var(--success-border))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          border: 'hsl(var(--warning-border))',
        },
        failure: {
          DEFAULT: 'hsl(var(--failure))',
          foreground: 'hsl(var(--failure-foreground))',
          border: 'hsl(var(--failure-border))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
          distinct: 'hsl(var(--muted-distinct))',
        },
        skeleton: {
          DEFAULT: 'hsl(var(--skeleton))',
          distinct: 'hsl(var(--skeleton-distinct))',
        },
        distinct: {
          DEFAULT: 'hsl(var(--distinct))',
          border: 'hsl(var(--distinct-border))',
        },
        image: {
          DEFAULT: 'hsl(var(--image))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
          distinct: 'hsl(var(--accent-distinct))',
          'distinct-foreground': 'hsl(var(--accent-distinct-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: `calc(var(--radius) + 4px)`,
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: [
          'var(--font-sans), -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
        ],
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
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
      },
    },
    screens,
  },
  variants: {
    extend: {},
  },
  plugins: [
    animate,
    typography,
    forms,
    gradients,
    plugin(function ({ addUtilities, theme, e, variants }) {
      const colors = theme('colors');
      const utilities = Object.entries(colors).map(
        ([colorName, colorValue]) => ({
          // eslint-disable-next-line sonarjs/no-nested-template-literals
          [`.${e(`bg-overlay-${colorName}`)}`]: {
            background: `linear-gradient(var(--overlay-angle, 0deg), ${colorValue}, transparent), var(--overlay-image)`,
            'background-position': 'center',
            'background-size': 'cover',
          },
        }),
      );
      addUtilities(utilities, variants('backgroundColor'));
    }),
  ],
};
