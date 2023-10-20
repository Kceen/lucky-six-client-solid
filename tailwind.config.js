/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gridTemplateRows: {
        9: 'repeat(9, minmax(0, 1fr))'
      },
      boxShadow: {
        rounded: '0px 0px 10px 1px'
      },
      brightness: {
        40: '0.4'
      }
    }
  },
  plugins: []
}
