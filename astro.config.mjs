import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import keystatic from '@keystatic/astro';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  adapter: cloudflare(),
  
  // Keystatic และ React อยู่ในหมวด integrations
  integrations: [
    keystatic(), 
    react()
  ],

  // Tailwind v4 ต้องย้ายมาอยู่ในหมวด vite plugins
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['@keystatic/core', 'lodash', 'lodash/debounce']
    },
    resolve: {
      dedupe: ['react', 'react-dom']
    }
  },
});