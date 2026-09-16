tailwind.config = {
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#4B2E83',
          dark: '#2D1147'
        },
        papaya: '#FF9142',
        sky: '#C6DEF1',
        gray: '#F4F4F4',
        yellow: '#FCD34D',
        red: '#EF3F3F',
        ink: '#0E0E0E'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace']
      },
      maxWidth: {
        'container': '1200px',
        'container-sm': '900px'
      }
    }
  }
};
