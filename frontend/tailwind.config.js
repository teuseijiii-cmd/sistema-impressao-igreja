
ARQUIVO: 18. frontend/tailwind.config.js<br/>
CAMINHO: frontend/tailwind.config.js<br/>
DESCRIÇÃO: Configuração do Tailwind CSS

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {<br/>
    extend: {<br/>
      colors: {<br/>
        primary: {<br/>
          50: '#f5f3ff',<br/>
          100: '#ede9fe',<br/>
          200: '#ddd6fe',<br/>
          300: '#c4b5fd',<br/>
          400: '#a78bfa',<br/>
          500: '#8b5cf6',<br/>
          600: '#7c3aed',<br/>
          700: '#6d28d9',<br/>
          800: '#5b21b6',<br/>
          900: '#4c1d95',
        },
        dark: {<br/>
          bg: '#121212',<br/>
          card: '#1e1e1e',<br/>
          border: '#333333'
        }
      },
      fontFamily: {<br/>
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {<br/>
        'fade-in': 'fadeIn 0.5s ease-out',<br/>
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {<br/>
        fadeIn: {<br/>
          '0%': { opacity: '0' },<br/>
          '100%': { opacity: '1' },
        },
        slideUp: {<br/>
          '0%': { transform: 'translateY(20px)', opacity: '0' },<br/>
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
