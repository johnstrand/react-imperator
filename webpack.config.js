const path = require('path');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const bundleOutputDir = './dist';

module.exports = () => {
    return [{
        optimization: {
            minimizer: [
                // we specify a custom UglifyJsPlugin here to get source maps in production
                new UglifyJsPlugin({
                  cache: true,
                  parallel: true,
                  uglifyOptions: {
                    compress: false,
                    ecma: 6,
                    mangle: true
                  },
                  sourceMap: true
                })
              ]
        },
        stats: { modules: false },
        entry: { 'ReactImperator': './src/ReactImperator.tsx' },
        resolve: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        output: {
            path: path.join(__dirname, bundleOutputDir),
            filename: '[name].js'
        },
        module: {
            rules: [
                { test: /\.tsx?$/, include: /src/, use: 'awesome-typescript-loader?silent=true' }
            ]
        },
        plugins: [
            new CheckerPlugin()
        ]
    }];
};