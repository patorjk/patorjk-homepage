import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"
//import {resolve} from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    assetsDir: "homepage-2025"
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      //'react': resolve(__dirname, 'node_modules/react'),
      //'react-dom': resolve(__dirname, 'node_modules/react-dom')
    },
  },/*
  optimizeDeps: {
    include: ['react', 'react-dom'],
  }*/
})
