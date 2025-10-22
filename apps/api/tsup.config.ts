import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/main/server.ts'],
  outDir: 'dist',
  format: ['esm'],
  minify: false,
  splitting: true,
  clean: true,
  target: 'node18',
})
