import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react'; // <-- 1. Import the main React plugin
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    // 2. Add the main react recommended config to the extends array
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      react.configs.recommended, // <-- This is the key addition
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      // 3. (Optional but good practice) Add parser settings for JSX
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // 4. Add settings for React (e.g., to auto-detect the version)
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
])
