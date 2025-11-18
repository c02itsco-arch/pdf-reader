/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#1e3a8a',
        'brand-secondary': '#3b82f6',
        'brand-light': '#dbeafe',
        'brand-dark': '#1e293b',
        'brand-text': '#f8fafc',
      }
    },
  },
  plugins: [],
}
