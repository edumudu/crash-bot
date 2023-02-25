import { defineConfig } from 'vite'
import { resolve } from 'path'


export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist/content'),
    emptyOutDir: false,
    minify: false,

    rollupOptions: {
      input: [
        resolve(__dirname, '../src/content/dom-bet.ts'),
      ],

      output: {
        format: 'iife',
        entryFileNames: '[name].js',
      }
    }
  }
});
