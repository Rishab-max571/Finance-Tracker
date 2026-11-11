/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf9",
          100: "#ccfbef",
          500: "#0f9d78",
          600: "#0b7d60",
          700: "#0a634d",
        },
      },
    },
  },
  plugins: [],
};
