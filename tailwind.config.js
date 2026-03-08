/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pixel: {
          dark: '#0f0f23',
          dark2: '#1a1a2e',
          dark3: '#16213e',
          purple: '#5c2a9d',
          purpleLight: '#8b5cf6',
          pink: '#ec4899',
          red: '#ef4444',
          orange: '#f97316',
          yellow: '#eab308',
          green: '#22c55e',
          cyan: '#06b6d4',
          blue: '#3b82f6',
          white: '#f8fafc',
        },
        retro: {
          bg: '#1e1e2e',
          surface: '#2a2a4a',
          border: '#4a4a6a',
          accent: '#ff6b9d',
          accent2: '#c792ea',
          accent3: '#82aaff',
          accent4: '#c3e88d',
          accent5: '#ffcb6b',
          text: '#eeffff',
          textMuted: '#8792a2',
        },
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', '"VT323"', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'monospace'],
      },
      boxShadow: {
        'pixel': '4px 4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-sm': '2px 2px 0px 0px rgba(0,0,0,0.5)',
        'pixel-glow': '0 0 20px rgba(139, 92, 246, 0.5)',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
