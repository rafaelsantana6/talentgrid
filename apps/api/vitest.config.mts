import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      format: {
        comments: 'all',
      },
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.ts', 'tests/**/*.{test,spec}.ts'],
    exclude: ['src/**/*.e2e.{test,spec}.ts'],
    globals: true,
    coverage: {
      reportOnFailure: true,
      reporter: ['cobertura', 'html-spa', 'text', 'text-summary'],
      provider: 'v8',
      all: false,
      cleanOnRerun: false,
      clean: true,
      reportsDirectory: 'coverage/unit',
      allowExternal: false,
      processingConcurrency: 16,
      watermarks: {
        branches: [50, 90],
        functions: [50, 90],
        lines: [50, 90],
        statements: [50, 90],
      },
    },
    pool: 'threads',
    maxConcurrency: 16,
    poolOptions: {
      threads: {
        singleThread: false,
        isolate: true,
        maxThreads: 16,
        minThreads: 8,
      },
      vmForks: {
        isolate: true,
        minForks: 8,
        maxForks: 16,
        memoryLimit: 256,
      },
      forks: {
        isolate: true,
        minForks: 8,
        maxForks: 16,
      },
      vmThreads: {
        singleThread: false,
        isolate: true,
        maxThreads: 16,
        minThreads: 8,
        memoryLimit: 256,
      },
    },
  },

  plugins: [
    tsconfigPaths({
      configNames: ['tsconfig.vitest.json'],
    }),
  ],
})
