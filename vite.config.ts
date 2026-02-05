
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Safely expose the API_KEY. 
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        // Manual chunks to separate vendor code from app code
        // This improves cache hit rates on Vercel deployments
        manualChunks: {
          vendor: ['react', 'react-dom', 'lucide-react'],
          genai: ['@google/genai'],
        }
      }
    }
  }
});
