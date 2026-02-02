/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'museum-black': '#080808',
        'museum-paper': '#e0e0e0', 
        'sage-green': '#739472',
        'muted-purple': '#80729C',
        'ice-blue': '#B5F3F5',
        'warm-ink': '#171717',
        'amber-glow': '#fbbf24',
        'stage-teal': '#69B7B2',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
        serif: ['Playfair Display', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      }
    },
  },
  plugins: [],
}