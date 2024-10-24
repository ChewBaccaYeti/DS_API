import { resolve as _resolve } from 'path';

export const entry = 'CEC/ships/USG_Ishimura/bridgeServer.ts';
export const output = {
    filename: 'bundle.js',
    path: _resolve(__dirname, 'archive'),
};
export const resolve = {
    extensions: ['.ts', '.js'],
};
export const module = {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        },
    ],
};
