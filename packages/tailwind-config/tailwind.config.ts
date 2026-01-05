import type { Config } from 'tailwindcss/types/config';
const colors = require('tailwindcss/colors');

export default {
  theme: {
    extend: {
      colors: {
        blue: colors.purple,
        sky: colors.purple,
        emerald: {
          DEFAULT: '#65f2f8',
          50: '#f0fdfe',
          100: '#e0f9fd',
          200: '#bdf2fa',
          300: '#8bebf6',
          400: '#65f2f8',
          500: '#65f2f8',
          600: '#06b6d4',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
          950: '#083344',
        },
        green: {
          DEFAULT: '#65f2f8',
          400: '#65f2f8',
          500: '#65f2f8',
        }
      },
    },
  },
  plugins: [],
} as Omit<Config, 'content'>;
