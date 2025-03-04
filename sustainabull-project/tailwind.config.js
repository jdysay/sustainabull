/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#64A7F8', 
        'custom-blue-light': '#BCDFFF', 
        'custom-blue-dark': '#3774AD',
        'custom-white': '#F1F1F1',
        'custom-grey': '#919191',
      },
    },
  },
  plugins: [],
}
