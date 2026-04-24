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
        greek: {
          dark: "#0D1117",
          "dark-deep": "#080C12",
          "dark-surface": "#161625",
          gold: "#C9A96E",
          "gold-light": "#D4AF37",
          "gold-bright": "#F5E6C8",
          "gold-dark": "#8B6914",
          bronze: "#CD7F32",
          marble: "#F5F0E8",
          "marble-cream": "#E8DFD0",
          parchment: "#F5E6D0",
          burgundy: "#5A1020",
          wine: "#6B0F1A",
          olive: "#556B2F",
          ink: "#2C1810",
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
        cinzel: ["var(--font-cinzel)", "serif"],
        cormorant: ["var(--font-cormorant)", "serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.6)",
        hero: "inset 0 -120px 120px -40px #0A0A0A",
        "gold-glow": "0 0 30px rgba(201,169,110,0.3), 0 0 60px rgba(201,169,110,0.15)",
        "gold-subtle": "0 0 20px rgba(201,169,110,0.15)",
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
        floatUp: {
          "0%": { opacity: "0", transform: "translateY(100vh) scale(0)" },
          "10%": { opacity: "1", transform: "scale(1)" },
          "90%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-10vh) scale(0)" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(201,169,110,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(201,169,110,0.4)" },
        },
        drawLine: {
          "0%": { height: "0%" },
          "100%": { height: "100%" },
        },
        scrollDown: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "50%": { opacity: "0.5", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        textReveal: {
          "0%": { opacity: "0", letterSpacing: "0.5em", filter: "blur(10px)" },
          "100%": { opacity: "1", letterSpacing: "0.3em", filter: "blur(0)" },
        },
        shimmerGold: {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
        meander: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "80px 0" },
        },
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        shimmer: "shimmer 1.2s linear infinite",
        "float-up": "floatUp 12s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "fade-in-left": "fadeInLeft 0.8s ease-out forwards",
        "fade-in-right": "fadeInRight 0.8s ease-out forwards",
        "scale-in": "scaleIn 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        "draw-line": "drawLine 2s ease-out forwards",
        "scroll-down": "scrollDown 2s ease-in-out infinite",
        "text-reveal": "textReveal 2s ease-out forwards",
        "shimmer-gold": "shimmerGold 4s ease-in-out infinite",
        meander: "meander 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
