const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
require('dotenv').config({ path: '.env' });

module.exports = {
    entry: './CEC/src/index.js',
    output: {
        path: path.resolve(__dirname, 'CEC/archive/dist'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { runtime: 'automatic' }],
                            '@babel/preset-typescript',
                        ],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './CEC/public/index.html',
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, './CEC/public'),
        },
        proxy: [
            {
                context: ['/api'],
                target: `http://localhost:${process.env.APP_PORT}`,
            },
        ],
        historyApiFallback: true,
        port: process.env.SERVER_PORT,
        open: true,
        hot: true,
        liveReload: true,
        watchFiles: {
            paths: ['CEC/styles/styles.css'],
            options: { usePolling: false },
        },
        client: {
            overlay: { errors: true, warnings: false },
            reconnect: true,
        },
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    },
};
