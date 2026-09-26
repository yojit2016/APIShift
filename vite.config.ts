import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: 'web',
  build: {
    outDir: '../dist/web',
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'node',
    include: ['demo-repo/tests/**/*.test.ts', 'tests/**/*.test.ts', 'src/**/*.test.ts']
  }
});
