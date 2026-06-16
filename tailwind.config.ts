import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#0052CC',
        primary: '#0052CC',
        'primary-dark': '#0040A3',
        'primary-light': '#EAF2FF',
        dark: '#1E293B',
        'dark-soft': '#FFFFFF',
        ink: '#1E293B',
        steel: '#64748B',
        'bg-soft': '#F8F9FA',
        industrial: '#F8F9FA',
        line: '#E2E8F0',
        accent: '#0052CC',
        cyan: '#0052CC',
        orange: '#0052CC',
        'white-soft': '#1E293B',
        gold: '#0052CC',
        'gold-dark': '#0040A3',
      },
      boxShadow: {
        card: '0 8px 24px rgba(15, 23, 42, 0.05)',
        raised: '0 18px 52px rgba(15, 23, 42, 0.06)',
        'gold-glow': '0 0 0 rgba(0,0,0,0)',
        'orange-glow': '0 12px 32px rgba(0, 82, 204, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', '"Helvetica Neue"', '"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        display: ['Inter', '"Helvetica Neue"', '"PingFang SC"', 'sans-serif'],
        technical: ['"IBM Plex Mono"', '"SF Mono"', '"Fira Code"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.02em',
        wider: '0.08em',
        widest: '0.14em',
      },
      animation: {
        'float-in': 'floatIn 0.7s ease-out both',
        'fade-up': 'fadeUp 0.75s ease-out both',
      },
      keyframes: {
        floatIn: {
          '0%': { opacity: '0', transform: 'translateX(-24px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
