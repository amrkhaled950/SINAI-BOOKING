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
        sinai: {
          cream: '#FAF6EF',
          creamDark: '#F4EEE4',
          sand: '#F7F2E9',
          card: '#F6F0E6',
          terracotta: '#C45437',
          terracottaHover: '#AB462C',
          navy: '#122432',
          navyDark: '#0D1B26',
          charcoal: '#22211F',
          muted: '#6C6963',
          green: '#2A7242',
          wave: '#2AA59B',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        script: ['"Caveat"', 'cursive'],
        scriptAr: ['"Marhey"', '"Aref Ruqaa"', 'cursive'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
