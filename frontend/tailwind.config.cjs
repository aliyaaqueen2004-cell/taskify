module.exports = {
  darkMode: 'class', // enable class-based dark mode
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#aa3bff',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
};
