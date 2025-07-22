import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      colors: {
        'primary-peach': '#F29F67',
        'primary-dark': '#1E1E2C',
        'support-blue': '#3B8FF3',
        'support-teal': '#34B1AA',
        'support-gold': '#E0B50F',
      },
    },
  },
  plugins: [react(), tailwindcss()],
})
