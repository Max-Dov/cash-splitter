const path = require('path');

module.exports = {
    mode: 'development',
    target: 'node',
    entry: './src/main.ts',
    resolve: {
        extensions: ['.ts', '.js']
    },
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                exclude: [
                    /node_modules/,
                ],
                include: [
                    path.resolve(__dirname, 'src'),
                ],
                test: /\.ts$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env'],
                            ['@babel/preset-typescript'],
                        ],
                        plugins: ["@babel/plugin-proposal-class-properties"],
                    }
                }
            }
        ]
    },
    output: {
        path: __dirname + '/build',
        filename: 'bundle.js'
    },
    externals: [
        {
            'utf-8-validate': 'commonjs utf-8-validate',
            bufferutil: 'commonjs bufferutil',
        },
    ],
}
