/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Light mode
        paper: '#F2F5F8',      // graph-paper background
        surface: '#FFFFFF',
        ink: '#1E2A3A',         // primary text, deep navy ink
        'ink-muted': '#5B6B7C',
        rule: '#C9D3DC',        // graph-paper grid lines / dividers
        forest: '#2F6F4E',      // positive / on-track accent
        'forest-light': '#E4F0E9',
        redpen: '#C44536',      // alert / behind-pace accent
        'redpen-light': '#FAEAE7',
        amber: '#E8A33D',       // AI / highlight accent
        'amber-light': '#FCF1DE',

        // Dark mode
        'paper-dark': '#0F1419',
        'surface-dark': '#1A2332',
        'ink-dark': '#E1E8EF',
        'ink-muted-dark': '#7A8B9C',
        'rule-dark': '#2A3544',
        'forest-dark': '#3D9B6A',
        'forest-light-dark': '#1A3328',
        'redpen-light-dark': '#2D1A17',
        'amber-light-dark': '#2D2415',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}
