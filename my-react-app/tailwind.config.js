/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        popmart: {
          yellow: '#FFD700',
          black: '#1A1A1A',
          gray: '#F5F5F7',
        }
      }
    },
  },
  plugins: [],
}