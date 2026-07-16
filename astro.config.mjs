import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  
  // Keystatic และ React อยู่ในหมวด integrations
  integrations: [
    react()
  ],

  // Tailwind v4 ต้องย้ายมาอยู่ในหมวด vite plugins
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: [ 'lodash', 'lodash/debounce']
    },
    resolve: {
      dedupe: ['react', 'react-dom']
    }
  },
});