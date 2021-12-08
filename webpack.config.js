/*const Encore = require('@symfony/webpack-encore');
const webpack =require('webpack');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/build')
    // only needed for CDN's or sub-directory deploy
    //.setManifestKeyPrefix('build/')

    .addEntry('index', './src/client/index.ts')
    .addEntry('base', './src/client/base.ts')
    //.addEntry('page2', './assets/page2.js')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()


    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // enables @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    })

// enables Sass/SCSS support
    .enableSassLoader()
    //.enablePostCssLoader()

   // .enableTypeScriptLoader((tsc)=>{
  //      tsc.appendTsSuffixTo = [/\.vue$/];
 //       return tsc;
  //  })
    .configureLoaderRule('ts', loaderRule => {
        loaderRule.test = ;
        loaderRule.options = {
            appendTsSuffixTo: [/\.vue$/],
        };
        loaderRule.exclude = '/node_modules/';
    })
    .addLoader({
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
            appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/
    })
    .addLoader({
        test: /\.vue$/,
        loader: 'vue-loader'
    })
//    .addPlugin(new webpack.DefinePlugin({
//        __VUE_OPTIONS_API__: true,
//        __VUE_PROD_DEVTOOLS__: false,
//    }))
// uncomment to get integrity="..." attributes on your script & link tags
// requires WebpackEncoreBundle 1.4 or higher
    .enableIntegrityHashes(Encore.isProduction())
    //.enableVueLoader(() => {}, { runtimeCompilerBuild: false })
    .configureLoaderRule('vue', loaderRule => {
        loaderRule.test = /\.vue$/;
    })
;*/

const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env, args) => {
    return {
        devtool: env.production ? 'source-map' : 'inline-source-map',
        mode: env.production ? 'production' : 'development',
        entry: {
            index: './src/client/index.ts',
            base: './src/client/base.ts'
        },
        resolve: {
            // Add `.ts` as a resolvable extension.
            extensions: ['.ts', '.js', '.vue'],
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
                        chunks: 'all',
                    },
                },
            },
        },
        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                },
                {
                    test: /\.ts$/,
                    loader: 'ts-loader',
                    options: {
                        appendTsSuffixTo: [/\.vue$/],
                    },
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
                        "sass-loader",
                    ],
                },
            ]
        },
        plugins: [
            new WebpackManifestPlugin({
                useEntryKeys: true,
                publicPath: 'build/',
                generate: (seed, files, entries) => {
                    console.log(files);
                    return entries
                }
            }),
            new MiniCssExtractPlugin({
                // Options similar to the same options in webpackOptions.output
                // both options are optional
                filename: "[name].css",
                chunkFilename: "[id].css",
            }),
            new VueLoaderPlugin(),
            new CleanWebpackPlugin(),
        ]
    }
};


