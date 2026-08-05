import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        blue: {
          950: "#040a18",
          900: "#0a1530",
          800: "#0f2148",
          700: "#163368",
          DEFAULT: "#4d7cf0",
          light: "#eaf0ff",
          dark: "#3560c9",
        },
        green: {
          950: "#03130b",
          900: "#082818",
          800: "#0d3c24",
          700: "#125032",
          DEFAULT: "#34c281",
          light: "#e6fbf1",
          dark: "#249a63",
        },
        purple: {
          950: "#0d0620",
          900: "#1c0f42",
          800: "#2a1863",
          700: "#3a2185",
          DEFAULT: "#9b5cf0",
          light: "#f4ecff",
          dark: "#7a3fd1",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
