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
        primary: {
          50: "#050505",
          100: "#1A1A1A",
        },
        minimal: {
          beige: "#D4C4B0",
          brown: "#8B7355",
          sand: "#C9B8A5",
          cream: "#F5F0E8",
        },
        neutral: {
          50: "#F5F5F5",
          100: "#BFBFBF",
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'film-out': 'film-out 620ms cubic-bezier(0.55, 0, 0.45, 1) both',
        'ken-burns': 'ken-burns var(--film-duration, 6000ms) linear both',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 196, 176, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(212, 196, 176, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'film-out': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.16)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translate3d(0, 0, 0)' },
          '100%': { transform: 'scale(1.09) translate3d(-1.2%, -1%, 0)' },
        },
      }
    },
  },
  plugins: [],
};

export default config;
