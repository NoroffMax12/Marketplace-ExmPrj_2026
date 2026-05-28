/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary:         '#16a34a',
        'primary-light': '#22c55e',
        'primary-dim':   '#dcfce7',
        sidebar:         '#0d1117',
        surface:         '#f0f4f8',
        card:            '#ffffff',
        border:          '#e2e8f0',
        muted:           '#64748b',
        danger:          '#dc2626',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card:         '0 1px 3px 0 rgb(0 0 0 / 0.07)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.10)',
        modal:        '0 20px 60px -10px rgb(0 0 0 / 0.25)',
      },
      keyframes: {
        'fade-in':  { from: { opacity: 0, transform: 'translateY(-6px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        'slide-in': { from: { opacity: 0, transform: 'translateX(-8px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
      },
      animation: {
        'fade-in':  'fade-in 0.2s ease-out',
        'slide-in': 'slide-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
}