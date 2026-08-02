/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F4F3E1",
        mist: "#F5F7FB", // cool near-white behind the calculator
        navy: {
          DEFAULT: "#102670",
          deep: "#0B1B3D",
        },
        solar: "#FFCC00",
        slate: {
          body: "#475569", // secondary text on light surfaces
        },
        mint: "#2CF59E", // accent / positive figures on dark surfaces
        glass: "rgba(114, 122, 165, 0.07)",
      },
      fontFamily: {
        display: ['"Moul"', "serif"],
        sans: ['"Montserrat"', "system-ui", "sans-serif"],
        body: ['"Mozilla Text"', '"Montserrat"', "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(16, 38, 112, 0.08)",
        lift: "0 12px 28px rgba(16, 38, 112, 0.14)",
      },
      backdropBlur: {
        glass: "14px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s ease-out both",
      },
    },
  },
  plugins: [],
};
