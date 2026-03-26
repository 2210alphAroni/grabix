/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "sans-serif"],
        mono:    ["'Space Mono'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
      },
      colors: {
        bg:      "#080b10",
        surface: "#0e1318",
        border:  "#1a2030",
        cyan:    "#00e5ff",
        rose:    "#ff3d6b",
        gold:    "#ffe03d",
        muted:   "#5a6578",
        success: "#00ff9d",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "spin-slow":  "spin 1s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(0,229,255,0.3)" },
          "50%":     { boxShadow: "0 0 40px rgba(0,229,255,0.6)" },
        },
      },
    },
  },
  plugins: [],
};
