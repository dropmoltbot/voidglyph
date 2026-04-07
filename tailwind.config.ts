import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#00ff9d',
          pink: '#ff007f',
          blue: '#00f7ff',
          purple: '#bf00ff',
          yellow: '#ffe600',
        },
        kawaii: {
          pink: '#ffb6c1',
          lilac: '#e6e6fa',
          mint: '#98ff98',
          cream: '#fff8dc',
        },
        dark: {
          bg: '#0a0a12',
          card: '#12121f',
          hover: '#1a1a2e',
          border: '#2a2a3e',
          input: '#16162a',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,255,157,0.3), 0 0 20px rgba(0,255,157,0.1)' },
          '50%': { boxShadow: '0 0 15px rgba(0,255,157,0.6), 0 0 40px rgba(0,255,157,0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        'neon-border': {
          '0%, 100%': { borderColor: '#00ff9d' },
          '33%': { borderColor: '#ff007f' },
          '66%': { borderColor: '#00f7ff' },
        },
        'typing': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-8px)', opacity: '1' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'scanline': 'scanline 3s linear infinite',
        'neon-border': 'neon-border 4s linear infinite',
        'typing': 'typing 1.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
