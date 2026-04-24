import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: "#E50914",
          "red-dark": "#B00710",
          black: "#0A0A0A",
          ink: "#141414",
          surface: "#1F1F1F",
          border: "#2A2A2A",
          text: "#E5E5E5",
          muted: "#A3A3A3",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.6)",
        hero: "inset 0 -120px 120px -40px #0A0A0A",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer: "shimmer 1.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
