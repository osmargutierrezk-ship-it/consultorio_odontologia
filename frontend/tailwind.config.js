/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D5A45',
          50:  '#f0f5f1',
          100: '#d9e8dc',
          200: '#b4d1bb',
          300: '#87b394',
          400: '#5e9370',
          500: '#3D5A45',
          600: '#2f4735',
          700: '#253828',
          800: '#1c2a1e',
          900: '#131d14',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#E8C96A',
          dark:  '#9E7E30',
        },
        beige: {
          DEFAULT: '#F5F0E8',
          dark:    '#EDE5D6',
        },
        forest: '#2C3E35',
      },
      fontFamily: {
        serif:  ['"Playfair Display"', 'Georgia', 'serif'],
        sans:   ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
      },
      animation: {
        'fade-up':   'fadeUp 0.6s ease forwards',
        'fade-in':   'fadeIn 0.5s ease forwards',
        'slide-in':  'slideIn 0.5s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(61, 90, 69, 0.08)',
        'card-hover': '0 8px 40px rgba(61, 90, 69, 0.16)',
        'gold': '0 4px 20px rgba(201, 168, 76, 0.25)',
      },
    },
  },
  plugins: [],
}
