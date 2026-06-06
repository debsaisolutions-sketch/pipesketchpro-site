import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'steel': '#2E6DA4',
        'steel-dark': '#1f4f7a',
        'steel-light': '#3d84c4',
        'trade-yellow': '#F5C518',
        'charcoal': '#1a1a1a',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
