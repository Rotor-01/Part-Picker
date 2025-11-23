import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting 'base' to an empty string ensures all asset paths are relative, 
  // which is crucial for Vercel's deployment environment.
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000 kB (1 MB)
  },
});

