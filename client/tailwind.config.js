/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        medical: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          // Brand colors
          red: '#C81E3A',
          darkRed: '#9E152B',
          teal: '#0D9488',
          lightTeal: '#CCFBF1',
          charcoal: '#1A1A1A'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'Poppins', 'sans-serif']
      },
      animation: {
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.45, 0, 0.55, 1) infinite',
        'subtle-bounce': 'subtleBounce 3s ease-in-out infinite'
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(200, 30, 58, 0.4)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 0 0 16px rgba(200, 30, 58, 0)' },
          '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(200, 30, 58, 0)' }
        },
        subtleBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        }
      }
    },
  },
  plugins: [],
}
