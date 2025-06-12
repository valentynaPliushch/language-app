/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "fff",
        secondary: "000000",
        light: {
          100: "#033399",
          200: "#486BB4",
          300: "#C8DFF9",
        },
      },
    },
  },
  plugins: [],
};
