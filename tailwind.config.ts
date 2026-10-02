import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0A08",
          900: "#100E0B",
          800: "#161310",
          700: "#1E1A15",
          600: "#2A241D"
        },
        ivory: {
          DEFAULT: "#E8DFC9",
          dim: "#C9BFA6",
          faint: "#8F8672",
          ghost: "#5C5546"
        },
        crimson: {
          DEFAULT: "#7E1E24",
          deep: "#4A1115",
          bright: "#A62B33"
        },
        bronze: {
          DEFAULT: "#A68A5B",
          dim: "#7A6644",
          faint: "#4A4030"
        },
        stone: "#14120E"
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      letterSpacing: {
        widest2: "0.28em"
      },
      animation: {
        fogA: "fogA 46s ease-in-out infinite alternate",
        fogB: "fogB 62s ease-in-out infinite alternate",
        ember: "ember 9s ease-in-out infinite",
        breathe: "breathe 7s ease-in-out infinite",
        ticker: "ticker 40s linear infinite"
      },
      keyframes: {
        fogA: {
          "0%": { transform: "translate3d(-6%, 2%, 0) scale(1.05)" },
          "100%": { transform: "translate3d(6%, -3%, 0) scale(1.12)" }
        },
        fogB: {
          "0%": { transform: "translate3d(5%, -2%, 0) scale(1.1)" },
          "100%": { transform: "translate3d(-7%, 3%, 0) scale(1.04)" }
        },
        ember: {
          "0%, 100%": { opacity: "0.25", transform: "translateY(0)" },
          "50%": { opacity: "0.7", transform: "translateY(-12px)" }
        },
        breathe: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.9" }
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
