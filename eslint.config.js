const { browser } = require('globals');
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
                ...browser,
            },
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        env: {
            browser: true,
            node: true,
            es6: true,
        },
        plugins: {
            '@typescript-eslint': tseslintPlugin,
            react: pluginReact,
            prettier: prettierPlugin,
        },
        rules: {
            // switch off default
            'no-unused-vars': 'off',

            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

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
            'no-shadow': 'error',
            'consistent-return': 'error',
            'max-lines': ['warn', 300],

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
            '@typescript-eslint/explicit-function-return-type': 'off',

            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/no-unescaped-entities': 'warn',
            'react/jsx-no-undef': 'error',
            'react/no-deprecated': 'warn',
            'react/jsx-max-props-per-line': ['error', { maximum: 3 }],

            // prettier
            'prettier/prettier': 'error',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
    prettierConfig,
];