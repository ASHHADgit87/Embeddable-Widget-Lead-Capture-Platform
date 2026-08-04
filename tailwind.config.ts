import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        graphite: {
          950: "#0a0a0b",
          900: "#111113",
          800: "#18181b",
          700: "#232327",
          600: "#2e2e33",
          500: "#4a4a52",
          400: "#6f6f78",
          300: "#9a9aa2",
          200: "#c5c5cb",
          100: "#e8e8ea",
        },
        accent: {
          DEFAULT: "#c9a876",
          muted: "#8a7454",
          bright: "#e0c395",
        },
        signal: {
          success: "#5fae7a",
          warning: "#d1a24a",
          danger: "#c2604f",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
