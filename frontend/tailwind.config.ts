import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 中式古典色调
        wood: {
          50: '#FAF5F0',
          100: '#F0E6D8',
          200: '#E0CCB0',
          300: '#C9A882',
          400: '#B08A5C',
          500: '#8B6914',  // 原木色
          600: '#6B4423',  // 深棕
          700: '#4A3728',  // 更深棕
          800: '#3A2A1E',
          900: '#2A1E16',
        },
        gold: {
          DEFAULT: '#D4AF37',
          light: '#FFD700',
          dark: '#B8960F',
        },
        cream: {
          DEFAULT: '#F5F5DC',
          dark: '#EEE8AA',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // 中文可使用系统字体或引入思源宋体
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'wood-pattern': "url('/images/wood-texture.png')",
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
