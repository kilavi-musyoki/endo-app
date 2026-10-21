/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f8f5f8',
          100: '#eee7ef',
          200: '#dbccdd',
          300: '#c3abc6',
          400: '#a986ad',
          500: '#906d94',
          600: '#7d5a81',
          700: '#69486d',
          800: '#583d5c',
          900: '#49334d',
        },
        sage: {
          50: '#f4f7f5',
          100: '#e5ece7',
          200: '#cddbd1',
          300: '#a7c1b1',
          400: '#7ba18c',
          500: '#5a846d',
          600: '#456956',
          700: '#385446',
          800: '#2f4439',
          900: '#283931',
        }
      }
    },
  },
  plugins: [],
}
