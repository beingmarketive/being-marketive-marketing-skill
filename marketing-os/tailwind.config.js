/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      colors: {
        ink: { 950: '#05070f', 900: '#070b19', 800: '#0d1326', 700: '#151d36' }
      },
      backgroundImage: {
        accent: 'linear-gradient(135deg,#7c5cff 0%,#3b82f6 50%,#22d3ee 100%)'
      }
    }
  },
  plugins: []
};
