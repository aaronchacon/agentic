import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { defineConfig } from 'vitest/config';

export default defineConfig(() => ({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/packages/agentic',
  plugins: [angular(), nxViteTsPaths()],
  test: {
    name: 'agentic',
    watch: false,
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.spec.ts'],
    reporters: ['default'],
    pool: 'threads',
    coverage: {
      reportsDirectory: '../../coverage/packages/agentic',
      provider: 'v8' as const,
    },
  },
}));
