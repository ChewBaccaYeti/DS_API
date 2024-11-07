const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.(css|scss)$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
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
        historyApiFallback: true,
        port: 3000,
        open: true,
    },
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
    },
};
