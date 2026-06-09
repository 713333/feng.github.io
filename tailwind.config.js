/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        ink: {
          50: "#F4F7FB",
          100: "#D6E1F0",
          200: "#A8B8D4",
          500: "#3C5A8A",
          700: "#1A3358",
          900: "#0B2545",
        },
        amber2: {
          500: "#E8A33D",
          600: "#C4841F",
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', "ui-serif", "Georgia", "serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(11, 37, 69, 0.25)",
        pop: "0 20px 50px -20px rgba(11, 37, 69, 0.45)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
