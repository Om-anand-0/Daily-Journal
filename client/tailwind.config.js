// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette
        'primary-dark': '#24293E',
        'accent-blue': '#8EBBFF',
        'text-light': '#F4F5FC',
        'secondary-gray': '#CCCCCC',
        // Additional shades for better design
        'primary-light': '#2D3548',
        'accent-light': '#A3C7FF',
        'accent-dark': '#6BA3FF',
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
