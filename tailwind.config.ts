import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.css",
  ],
  // Safelist: классы из @apply в CSS-модулях иногда не попадают в purge на prod
  safelist: [
    { pattern: /^(bg|border|text|ring|from|to|via)-graphite-\d+/ },
    { pattern: /^border-(b|t|l|r)-graphite-\d+/ },
  ],
  theme: {
    extend: {
      colors: {
        /* Референс persona-teatrkrug: чёрно-белая гамма */
        graphite: {
          50: "#fafafa",
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#1a1a1a",
        },
        "accent-red": "rgb(197 35 37)",
      },
      fontFamily: {
        posterama: ["var(--font-posterama)", "sans-serif"],
        serif: ["var(--font-posterama)", "sans-serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "quote-in": "quoteIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        quoteIn: {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
