/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/react";


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'regular': "var(--font-regular)",
        'medium': "var(--font-medium)",
        'semibold': "var(--font-semibold)",
        'bold': "var(--font-bold)",
      },
      colors: {
        primary: "#C3BEF5",
        cancel: "#dddbf8",
        success: '#b8b4e7',
        sidebar: '#424B96',
        background: '#EEEFF5'
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

