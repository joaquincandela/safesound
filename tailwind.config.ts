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
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 196, 176, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(212, 196, 176, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
