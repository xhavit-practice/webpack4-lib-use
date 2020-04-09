const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const rootDir = path.resolve(__dirname, '.');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');

module.exports = {
    entry: {
        'webpack.umd': path.join(srcDir, 'webpack.umd.js'),
        'webpack.cjs': path.join(srcDir, 'webpack.cjs.js'),
    },
    mode: 'development',
    devtool: 'none',
    output: {
        path: distDir,
        filename: '[name].js',
    },
    module: {
        rules: [
            // js
            {
                test: /\.js$/,
                use: ['babel-loader'],
            },
        ],
    },
    optimization: {
        runtimeChunk: {
            name: (entryPoint) => `~runtime.${entryPoint.name}`,
        },
        splitChunks: {
            chunks: 'all',
            minSize: 1024 * 0,
            automaticNameDelimiter: '.',
            automaticNameMaxLength: 30,
            hidePathInfo: true,
            cacheGroups: {
                default: false,
                defaultVendors: false,
                '~vendor': {
                    test: /[\\/]node_modules[\\/]/,
                    maxSize: 1024 * 500,
                    enforce: true,
                    priority: 10,
                },
                common: {
                    minChunks: 2,
                    // 当前js entry chunk能并行加载js on-demand chunk的最大数目
                    maxAsyncRequests: 100,
                    // 当前html入口初始加载js entry chunk的最大数目
                    maxInitialRequests: 100,
                    priority: 9,
                },
            },
        },
    },
    plugins: [
        new CleanWebpackPlugin(),
        new BundleAnalyzerPlugin({ analyzerMode: 'static' }),
        new HtmlWebpackPlugin({
            filename: 'webpack.umd.html',
            chunks: ['webpack.umd'],
        }),
        new HtmlWebpackPlugin({
            filename: 'webpack.cjs.html',
            chunks: ['webpack.cjs'],
        }),
    ],
};
