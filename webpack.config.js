const path = require('path');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const bundleOutputDir = './dist';

module.exports = () => {
    return [{
        mode: 'production',
        optimization: {
            minimizer: [
                // we specify a custom UglifyJsPlugin here to get source maps in production
                new UglifyJsPlugin({
                    cache: true,
                    parallel: true,
                    uglifyOptions: {
                        compress: false,
                        ecma: 5,
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
            filename: '[name].js',
            libraryTarget: 'umd',
            library: 'ReactImperator',
            umdNamedDefine: true
        },
        externals: {
            react: {
                commonjs: 'react',
                commonjs2: 'react',
                amd: 'react',
                root: 'React'
            }
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: /src/,
                    use: 'awesome-typescript-loader',
                    exclude: /node_modules/
                }
            ]
        },
        plugins: [
            new CheckerPlugin()
        ]
    }];
};