import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Vite configuration
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: "/", // Base is "/" to use absolute paths after deployment
  build: {
    polyfillModulePreload: false,
    rollupOptions: {
      output: {
        entryFileNames: "assets/[name].[hash].module.js", // JavaScript entry files with hash and .module.js extension
        chunkFileNames: "assets/[name].[hash].module.js", // JavaScript chunk files with hash and .module.js extension
        assetFileNames: ({ name }) => {
          if (name && name.endsWith('.css')) {
            return 'assets/[name].[hash].css'; // CSS files with hash and .css extension
          }
          return 'assets/[name].[hash][extname]'; // Other asset types
        }
      }
    }
  }
});
