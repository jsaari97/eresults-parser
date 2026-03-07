import tseslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['jest.config.js', 'dist/**'],
  },
  ...tseslint.configs['flat/recommended'],
  prettier,
];
