import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        emerald: {
          950: "#02140d",
          900: "#062a1b",
          800: "#0a3f28",
          700: "#0f5536",
          600: "#146b44",
          DEFAULT: "#00c853",
        },
        green: {
          DEFAULT: "#34c281",
          light: "#e6fbf1",
          dark: "#249a63",
        },
        purple: {
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
