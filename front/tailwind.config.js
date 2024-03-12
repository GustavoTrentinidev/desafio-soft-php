/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nunito': ["Nunito Sans", 'sans-serif'] 
      },
      fontWeight: {
        'bolder': 1000
      },
      height: {
        '100vh': '100vh'
      }
    },
  },
  plugins: [],
}

