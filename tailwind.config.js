/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '50%': { width: '33%' },
          '100%': { width: '0%' }
        }
      },
      animation: {
        'progress': 'progress 2s ease-in-out infinite'
      }
    },
  },
  plugins: [],
} 