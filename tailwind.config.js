/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/popup/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#F5A623",
          dark: "#D9890F",
          light: "#FDF1DD",
        },
        ink: {
          DEFAULT: "#171717",
          muted: "#71717A",
          soft: "#A1A1AA",
        },
        success: {
          DEFAULT: "#22C55E",
          light: "#E9F9EE",
          text: "#15803D",
        },
        info: {
          DEFAULT: "#2563EB",
          light: "#EAF1FE",
          text: "#1D4ED8",
        },
        pdf: "#EA4335",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
