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
        'garage-black': '#000000',
        'garage-white': '#FFFFFF',
        'garage-gray': '#1F1F1F',
        'garage-light-gray': '#F5F5F5',
        'garage-accent': '#E10600',
        'garage-accent-dark': '#B80500',
        'garage-gold': '#FFD700',
        brand: {
          DEFAULT: '#E10600',
          dark: '#8E0A08',
          deeper: '#4A0B0A',
        },
        ink: {
          DEFAULT: '#0B0B0C',
          800: '#141416',
          700: '#1D1D20',
          600: '#2A2A2E',
        },
        paper: '#FFFFFF',
        stone: '#F3F2EF',
        ghost: '#EFEEEA',
        line: '#E3E1DC',
        muted: '#6B6E75',
      },
      fontFamily: {
        sans: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        display: ['var(--font-barlow-condensed)', 'var(--font-barlow)', 'system-ui', 'sans-serif'],
        admin: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3.25rem, 8.5vw, 7.5rem)', { lineHeight: '0.9' }],
        'display': ['clamp(2.25rem, 5vw, 4rem)', { lineHeight: '0.95' }],
      },
    },
  },
  plugins: [],
}
export default config
