const { browser } = require('globals'); // Corrected import
const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

module.exports = [
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
        languageOptions: {
            globals: {
                ...browser, // Use the 'browser' global only
            },
            parser: tsParser,
            parserOptions: {
                project: './tsconfig.json', // Path to TypeScript config
            },
        },
        plugins: {
            '@typescript-eslint': tseslintPlugin,
            react: pluginReact,
        },
    },
    {
        // JavaScript rules
        rules: {
            'no-unused-vars': 'error',
            'no-undef': 'error',
            'no-console': 'warn',
            eqeqeq: 'error',
            curly: 'error',
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            'no-trailing-spaces': 'error',
            'comma-dangle': ['error', 'always-multiline'],
            'no-var': 'error',
            'prefer-const': 'error',
            'arrow-parens': ['error', 'as-needed'],
            'prefer-arrow-callback': 'error',
            'no-shadow': 'error', // Prevent variable shadowing
            'consistent-return': 'error', // Enforce consistent return statements
            'max-lines': ['warn', 300], // Limit the number of lines in a file
            '@typescript-eslint/no-explicit-any': 'off',
        },
    },
    {
        // TypeScript rules from @typescript-eslint
        rules: {
            '@typescript-eslint/no-unused-vars': ['error'],
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-non-null-assertion': 'error',
            '@typescript-eslint/member-ordering': [
                'error',
                {
                    default: [
                        'public-static-field',
                        'protected-static-field',
                        'private-static-field',
                    ],
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off', // Disable for general cases, enable if needed in specific cases
        },
    },
    {
        // React rules from eslint-plugin-react
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/react-in-jsx-scope': 'error',
            'react/prop-types': 'off', // if using TypeScript for type checking
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'warn',
            'react/jsx-no-undef': 'error',
            'react/no-deprecated': 'warn',
            'react/jsx-max-props-per-line': ['error', { maximum: 3 }], // Limit props per line
        },
    },
    prettierConfig, // Integrate Prettier config to disable conflicting rules
    {
        rules: {
            'prettier/prettier': 'error',
        },
        plugins: {
            prettier: prettierPlugin,
        },
    },
];
