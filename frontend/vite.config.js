import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/flights': 'http://localhost:8080',
      '/bookings': 'http://localhost:8080',
      '/passengers': 'http://localhost:8080',
      '/payments': 'http://localhost:8080'
    }
  }
});
