import { defineConfig } from 'vite'
import { resolve } from 'path'


export default defineConfig({
  build: {
    outDir: resolve(__dirname, '../dist/background'),
    emptyOutDir: false,
    minify: false,

    rollupOptions: {
      preserveEntrySignatures: 'strict',

      input: [
        resolve(__dirname, '../src/background/index.ts'),
      ],

      output: {
        format: 'iife',
        entryFileNames: '[name].js',
      }
    }
  }
});
