
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        eink: {
          black: "#000000",
          darkGray: "#333333",
          gray: "#666666",
          lightGray: "#E5E5E5",
          white: "#FFFFFF",
        },
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
      fontFamily: {
        quicksand: ["Quicksand", "system-ui", "sans-serif"],
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
