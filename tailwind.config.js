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
        'thin': "var(--font-thin)",
        'light': "var(--font-light)",
        'regular': "var(--font-regular)",
        'medium': "var(--font-medium)",
        'semibold': "var(--font-semibold)",
        'bold': "var(--font-bold)",
      },
      colors: {
        primary: "#68947c",
        cancel: "#68947c",
        success: '#68947c',
        sidebar: '#508267',
        background: '#EEEFF5'
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

