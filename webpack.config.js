const path = require('path');
const webpack = require('webpack');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const {VueLoaderPlugin} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',

    entry: {
        index: './src/client/index.ts'
    },

    output: {
        path: path.resolve(__dirname, 'public/build'),
        publicPath: 'build/'
    },

    plugins: [
        new webpack.ProgressPlugin(),
        new MiniCssExtractPlugin({ filename:'main.[contenthash].css' }),
        new WebpackManifestPlugin({
            basePath: '',
            //useEntryKeys: true,
            //filter: a => true
            generate: (seed, files, entries) => {
                console.log(seed);
                console.log(files)
                console.log(entries)
                return entries;
            }
        }),
        new VueLoaderPlugin(),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader',
            options: {
                appendTsSuffixTo: [/\.vue$/],
            }
        }, {
            test: /.(sa|sc|c)ss$/,

            use: [{
                loader: MiniCssExtractPlugin.loader
            }, {
                loader: "css-loader",

                options: {
                    sourceMap: true
                }
            }, {
                loader: "sass-loader",

                options: {
                    sourceMap: true
                }
            }]
        },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },]
    },
    optimization: {
        splitChunks: { chunks: "all" },
        runtimeChunk: { name: "runtime" },
    },
}
