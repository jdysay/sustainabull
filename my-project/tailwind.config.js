/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue-dark': '#64A7F8', // Custom Dark Blue
        'custom-blue-light': '#BCDFFF', // Custom Light Blue
      },
    },
  },
  plugins: [],
}
