// ESLint config (tool config files stay .js — every app source file is TypeScript).
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  { ignores: ['dist/*', '.expo/*', 'node_modules/*'] },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // No `any` — ever. Use a real type, a generic, or `unknown` + narrowing.
      '@typescript-eslint/no-explicit-any': 'error',
      // No silencing the compiler with @ts-ignore / @ts-nocheck.
      '@typescript-eslint/ban-ts-comment': 'error',
      // Prefer `import type` for type-only imports.
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
]);
