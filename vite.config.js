import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173, // Default Vite port
    open: true, // Automatically open the browser
    historyApiFallback: true, // Enable SPA fallback
  },
  proxy: {
    '/api': {
      target: 'https://reactive-zone-backend.vercel.app',
      changeOrigin: true,
      secure: false
    }
  }
});
