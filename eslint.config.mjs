import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
    { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    pluginReact.configs.flat.recommended,
    prettierConfig, // Turning off conflict rules ESLint
    {
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'prettier/prettier': 'error', // turning on checking Prettier
        },
        plugins: {
            prettier: prettierPlugin,
        },
    },
];