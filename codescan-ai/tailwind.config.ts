import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        danger: '#EF4444',
        warning: '#F59E0B',
        success: '#10B981',
        surface: '#1E1E2E',
        card: '#2A2A3E',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config

// Made with Bob
