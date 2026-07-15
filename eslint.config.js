const globals = require('globals');
const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const pluginReact = require('eslint-plugin-react');
const prettierConfig = require('eslint-config-prettier');
const prettierPlugin = require('eslint-plugin-prettier');

const sharedGlobals = { ...globals.browser, ...globals.node };

const sharedPlugins = {
    '@typescript-eslint': tseslintPlugin,
    react: pluginReact,
    prettier: prettierPlugin,
};

const sharedRules = {
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
    quotes: [
        'error',
        'single',
        { avoidEscape: true, allowTemplateLiterals: true },
    ],
    'no-trailing-spaces': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    'no-var': 'error',
    'prefer-const': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'prefer-arrow-callback': 'error',
    'no-shadow': 'error',
    'consistent-return': 'error',
    'max-lines': ['warn', 500],
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-non-null-assertion': 'error',
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
    'prettier/prettier': 'error',
};

module.exports = [
    // ── Global ignores: never lint build output, deps, dist, static assets ──
    {
        ignores: [
            'CEC/archive/**',
            'node_modules/**',
            'dist/**',
            'coverage/**',
            'CEC/styles/*.css',
            'CEC/styles/*.css.map',
        ],
    },

    // ── Backend TypeScript sources (typed lint w/ tsconfig) ────────────────
    // Only .ts files are tsc-compiled; .tsx go through babel and are linted
    // in the frontend block below without the TS project.
    {
        files: ['CEC/**/*.ts'],
        languageOptions: {
            globals: sharedGlobals,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
                ecmaFeatures: { jsx: false },
            },
        },
        plugins: sharedPlugins,
        rules: sharedRules,
        settings: { react: { version: 'detect' } },
    },

    // ── Frontend JS/JSX/TSX (babel-only, no TS project) ────────────────────
    {
        files: ['CEC/**/*.{js,jsx,mjs,cjs}', 'CEC/**/*.tsx'],
        languageOptions: {
            globals: sharedGlobals,
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: sharedPlugins,
        rules: sharedRules,
        settings: { react: { version: 'detect' } },
    },

    // ── Node scripts + config files (no TS project, no React) ──────────────
    {
        files: [
            'scripts/**/*.{ts,js}',
            '*.config.{js,cjs,mjs}',
            'webpack.config.js',
            'babel.config.json',
            'postcss.config.js',
            'eslint.config.js',
        ],
        languageOptions: {
            globals: { ...globals.node },
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                ecmaFeatures: { jsx: false },
            },
        },
        plugins: {
            '@typescript-eslint': tseslintPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            ...sharedRules,
            'no-console': 'off',
            'react/jsx-uses-react': 'off',
            'react/jsx-uses-vars': 'off',
            'react/jsx-no-undef': 'off',
            'react/jsx-max-props-per-line': 'off',
            'react/no-unescaped-entities': 'off',
            'react/no-deprecated': 'off',
        },
    },

    prettierConfig,
];
