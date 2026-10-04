/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ecff',
          200: '#bcdcff',
          300: '#8ec6ff',
          400: '#59a6ff',
          500: '#3286fc',
          600: '#1c66f2',
          700: '#1551e0',
          800: '#1843b6',
          900: '#1a3d8f',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        expense: {
          primary: '#1c66f2',
          'primary-content': '#ffffff',
          secondary: '#0f172a',
          accent: '#10b981',
          neutral: '#1f2937',
          'base-100': '#ffffff',
          'base-200': '#f8fafc',
          'base-300': '#eef2f7',
          'base-content': '#1f2937',
          info: '#3286fc',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
        },
      },
    ],
  },
};
