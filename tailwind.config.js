/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(248, 248, 246)',
        ink: 'rgb(61, 61, 59)',
        muted: 'rgb(106, 106, 103)',
        hairline: 'rgb(228, 227, 221)',
        chip: 'rgb(241, 240, 234)'
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      maxWidth: {
        container: '960px'
      },
      borderRadius: {
        pill: '9999px'
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.04), 0 0 0 1px rgb(228,227,221)'
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-up': 'fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1) both'
      }
    }
  },
  plugins: []
};
