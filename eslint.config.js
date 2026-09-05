import eslintPluginAstro from 'eslint-plugin-astro';
import typescriptParser from '@typescript-eslint/parser';

export default [
  { ignores: ['.astro/**', 'dist/**', 'node_modules/**', 'public/**', 'tests/fixtures/**'] },
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: { parser: typescriptParser },
    },
  },
];
