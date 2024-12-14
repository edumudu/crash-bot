import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],

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
