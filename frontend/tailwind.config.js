/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6D28D9', // Clueso violet
          light: '#8B5CF6',
          hover: '#5B21B6',
        },
        bg: {
          primary: '#F8FAFC',
          secondary: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0px 4px 20px rgba(15, 23, 42, 0.03)',
        'hover': '0px 20px 40px -10px rgba(15, 23, 42, 0.08)',
        'button': '0px 4px 12px rgba(109, 40, 217, 0.25)',
      }
    },
  },
  plugins: [],
}
