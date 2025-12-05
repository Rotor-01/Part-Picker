/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "false", // Disabled
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#0A0A0A", // High contrast border
        input: "#0A0A0A",
        ring: "#2563EB",
        background: "#FAFAF9", // Cream
        foreground: "#0A0A0A", // Black
        primary: {
          DEFAULT: "#2563EB", // Electric Blue
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F5F5F4", // Slightly darker cream
          foreground: "#0A0A0A",
        },
        destructive: {
          DEFAULT: "#DC2626",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F5F5F4",
          foreground: "#525252",
        },
        accent: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        popover: {
          DEFAULT: "#FAFAF9",
          foreground: "#0A0A0A",
        },
        card: {
          DEFAULT: "#FAFAF9",
          foreground: "#0A0A0A",
        },
      },
      borderRadius: {
        lg: "0px", // Brutalist - no rounded corners
        md: "0px",
        sm: "0px",
        full: "9999px", // Keep full for specific pill buttons if needed, but mostly avoid
      },
      boxShadow: {
        subtle: "none",
        medium: "4px 4px 0px 0px rgba(10, 10, 10, 1)", // Hard shadow
        large: "8px 8px 0px 0px rgba(10, 10, 10, 1)", // Larger hard shadow
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "Inter", // Ideally would use a more distinctive font, but Inter weight 800+ works for now
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
      },
      fontSize: {
        "7xl": "5rem",
        "8xl": "6rem",
        "9xl": "8rem",
        "10xl": "10rem",
        "huge": "12rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
