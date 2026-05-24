export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        campaign: {
          red: '#7f1d1d',
          dark: '#090909',
          gold: '#d4a017',
        },
      },
      boxShadow: {
        glow: '0 20px 45px rgba(127, 29, 29, 0.4)',
      },
    },
  },
  plugins: [],
}
