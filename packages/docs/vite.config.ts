/// <reference types="vitest" />

import analog from '@analogjs/platform';
import { defineConfig } from 'vite';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    root: __dirname,
    // Deploy base (e.g. /agentic/ on GitHub Pages). Defaults to / for local dev.
    base: process.env.DOCS_BASE_HREF ?? '/',
    cacheDir: `../../node_modules/.vite`,
    build: {
      outDir: '../../dist/packages/docs/client',
      reportCompressedSize: true,
      target: ['es2020'],
    },
    server: {
      fs: {
        allow: ['.'],
      },
    },
    plugins: [
      analog({
        // Fully static site: prerender every docs route, no SSR server needed.
        static: true,
        prerender: {
          routes: [
            '/',
            '/theming',
            '/provenance',
            '/components/chat',
            '/components/tool-call',
            '/components/suggestion',
            '/components/summary',
            '/components/sidebar',
            '/components/plan',
            '/components/approval',
          ],
        },
      }),
      nxViteTsPaths(),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['src/test-setup.ts'],
      include: ['**/*.spec.ts'],
      reporters: ['default'],
    },
  };
});
