/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        gold: '#D4AF37',
        'gold-light': '#F5D67B',
        wood: {
          300: '#A1887F',
          600: '#6D4C41',
          700: '#5D4037',
          800: '#4E342E',
          900: '#3E2723',
        },
        jade: '#00A86B',
        cinnabar: '#E34234',
        ink: '#2D2A26',
        bronze: '#CD7F32',
        moss: '#8A9A5B',
        paper: '#F5F5DC',
        vermillion: '#E34234',
      },
    },
  },
  plugins: [],
}
