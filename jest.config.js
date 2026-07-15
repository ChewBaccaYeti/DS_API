/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/tests'],
    testMatch: ['**/*.test.ts'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    module: 'CommonJS',
                    moduleResolution: 'node',
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                    jsx: 'react-jsx',
                    target: 'ES2020',
                    lib: ['ES2020', 'DOM'],
                    strict: true,
                    isolatedModules: true,
                    skipLibCheck: true,
                },
            },
        ],
    },
    collectCoverageFrom: [
        'CEC/ships/USG_Ishimura/bridge/utils/**/*.ts',
        '!CEC/archive/**',
    ],
    verbose: true,
};
