/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnightp1' : '#01010c',
        'midnightp2' : '#25070f'
      }
    },
  },
  plugins: [
    require('tailwindcss-animated')
  ],
}