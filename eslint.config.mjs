import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
      "ignores": [
        "**/dist",
        "**/vite.config.*.timestamp*",
        "**/vitest.config.*.timestamp*"
      ]
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:agentic',
              onlyDependOnLibsWithTags: ['scope:agentic'],
            },
            {
              // The docs app consumes the published libraries as a real consumer would.
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:app', 'type:runtime', 'type:themes'],
            },
            {
              // The Angular runtime may use the framework-agnostic themes.
              sourceTag: 'type:runtime',
              onlyDependOnLibsWithTags: ['type:runtime', 'type:themes'],
            },
            {
              // Themes are framework-agnostic and must not depend on the runtime.
              sourceTag: 'type:themes',
              onlyDependOnLibsWithTags: ['type:themes'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
