/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Quicksand"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        road: {
          50: '#f2f8fc',
          100: '#e3f0f9',
          200: '#c3e0f2',
          300: '#93c8e6',
          400: '#5ba6d3',
          500: '#3688ba',
          600: '#276c9c',
          700: '#21577e',
          800: '#204a69',
          900: '#1f3f59',
        },
        expense: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          400: '#f87171',
          500: '#e0483e',
          600: '#c62f27',
          700: '#a3241d',
        },
        income: {
          50: '#f0faf3',
          100: '#dcf5e3',
          200: '#b8e9c6',
          400: '#4cb670',
          500: '#2f9c54',
          600: '#227e42',
          700: '#1c6636',
        },
      },
      boxShadow: {
        soft: '0 8px 24px -8px rgba(31, 63, 89, 0.18)',
      },
      backgroundImage: {
        'dotted-road': 'repeating-linear-gradient(90deg, #ffffff 0 14px, transparent 14px 26px)',
      },
    },
  },
  plugins: [],
}
