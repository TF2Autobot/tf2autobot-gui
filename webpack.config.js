const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");

const env = {
	production: process.env.NODE_ENV === 'production'
};

module.exports = {
	devtool: env.production ? 'source-map' : 'inline-source-map',
	mode: env.production ? 'production' : 'development',
	entry: {
		index: './src/client/index.ts',
		base: './src/client/base.ts',
		trades: './src/client/trades.ts'
	},
	resolve: {
		// Add `.ts` as a resolvable extension.
		extensions: ['.ts', '.js', '.vue']
	},
	output: {
		path: path.resolve(__dirname, 'public/build/'),
		filename: '[name].js', //.[contenthash],
		publicPath: '/build'
	},
	optimization: {
		moduleIds: 'deterministic',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					appendTsSuffixTo: [/\.vue$/]
				}
				//exclude: /node_modules/,
			},
			{
				test: /\.s[ac]ss$/i,
				use: [
					// Creates `style` nodes from JS strings
					MiniCssExtractPlugin.loader,
					// Translates CSS into CommonJS
					"css-loader",
					// Compiles Sass to CSS
					"sass-loader"
				]
			}
		]
	},
	plugins: [
		new WebpackManifestPlugin({
			useEntryKeys: true,
			publicPath: '',
			generate: (seed, files, entries) => {
				return entries;
			}
		}),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(),
		new webpack.DefinePlugin({
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false
		})
	]
}


