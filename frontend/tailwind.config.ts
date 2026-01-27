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
        'garage-accent': '#FF6B35',
        'garage-accent-dark': '#E55A2B',
        'garage-gold': '#FFD700',
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 8rem)', { lineHeight: '1.1' }],
        'display': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.2' }],
      },
    },
  },
  plugins: [],
}
export default config

