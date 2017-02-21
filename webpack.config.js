const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        'styles/bundle': [path.join(__dirname, '/scripts/index.ts')]
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'bin')
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.join(__dirname, '/node_modules')]
    },
    resolveLoader: {
        modules: [path.join(__dirname, '/node_modules')]
    },
    module: {
        rules: [
            {
                test: /search\.worker\.ts$/,
                use: 'worker-loader',
                exclude: ['node_modules']
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: ['node_modules']
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{ loader: 'css-loader' },
                    { loader: 'sass-loader' }]
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('styles/bundle.css'),
        new webpack.ProvidePlugin({
            $: 'jquery',
            'window.jQuery': 'jquery',
            jQuery: 'jquery'
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                worker: {
                    output: {
                        filename: "styles/[hash].worker.js"
                    }
                }
            }
        })
    ]
};