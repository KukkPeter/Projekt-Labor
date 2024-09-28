import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import solidSvg from 'vite-plugin-solid-svg';

export default defineConfig({
  plugins: [
    solidPlugin(),
    solidSvg()
  ],
  server: {
    port: 3000,
  },
  base: '',
  build: {
    rollupOptions: {
      output: {
        format: 'iife'
      }
    },
    target: 'ES6',
    sourcemap: true,
    emptyOutDir: true
  }
});
