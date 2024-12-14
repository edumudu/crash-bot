import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],

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
