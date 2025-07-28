/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        scara: {
          bg: "#0f0f1a",
          primary: "#4a3b8c",
          accent: "#b689f0",
          gold: "#e6c27a",
        },
        wanderer: {
          bg: "#9CBEBD", // soft sky background
          text: "#1e1e2f", // calm dark text
          accent: "#6b74d6", // Wanderer's indigo highlight
          card: "#ffffff", // card/container bg
          border: "#e0e4f1", // soft outline
          hover: "#8f98eb", // hover accent
        },
      },
      fontFamily: {
        elegant: ['"Open Sans"', "sans-serif"],
        thin: ['"Nunito"', "sans-serif"],
      },
    },
  },
  // plugins: [require("tailwind-scrollbar")],
  plugins: [],
};
