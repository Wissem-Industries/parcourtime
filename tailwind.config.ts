/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{vue,js,ts}",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'blue-france': {
          DEFAULT: '#000091',
          hover: '#1212ff',
          active: '#2323ff',
        }
      },
      fontFamily: {
        'marianne-bold': ['Marianne-Bold', 'sans-serif'],
        'marianne-medium': ['Marianne-Medium', 'sans-serif'],
        'marianne-regular': ['Marianne-Regular', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

