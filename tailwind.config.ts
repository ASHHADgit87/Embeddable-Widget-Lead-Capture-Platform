import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        white: "#ffffff",
        emerald: {
          950: "#1f1007",
          900: "#291708",
          800: "#3c1d0a",
          700: "#523014",
          600: "#6b421f",
          DEFAULT: "#8b5e34",
        },
        green: {
          DEFAULT: "#8b5e34",
          light: "#f7efe4",
          dark: "#6d4b2f",
        },
        lime: {
          500: "#a77c4a",
          400: "#b48a5d",
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
