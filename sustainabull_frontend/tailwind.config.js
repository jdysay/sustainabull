/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        },
      colors: {
        'custom-blue': '#64A7F8', 
        'custom-blue-light': '#BCDFFF', 
        'custom-blue-dark': '#3774AD',
        'custom-white': '#F1F1F1',
        'custom-grey': '#919191',
        'custom-orange':'#EB9C5B',
        'custom-orange-dark': '#DD7431',
      },
    },
  },
  plugins: [],
}
