import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/mubarak-product/', // Add base configuration
  server: {
    // Optional: Add history fallback for SPA routing
    historyApiFallback: {
      index: '/mubarak-product/'
    }
  }
});
