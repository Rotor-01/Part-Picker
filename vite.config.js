import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Setting 'base' to an empty string ensures all asset paths are relative, 
  // which is crucial for Vercel's deployment environment.
  base: './', 
});

