import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    target: 'es2022',
    // Three.js is the single largest dependency; keep it in its own chunk so the
    // app shell (world chooser, lesson text) loads before the 3D runtime.
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (/node_modules\/(three|@react-three)\//.test(id)) return 'three';
          if (/node_modules\/katex\//.test(id)) return 'katex';
          return undefined;
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
});
