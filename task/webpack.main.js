
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { default: tsConfigPaths } = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: './src/main/main.ts',
  // don't want to mangle table names
  mode: 'development',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.js',
  },
  externals: [
    nodeExternals()
  ],
  target: 'electron-main',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },
  resolve: {
    alias: {
      '@main': path.resolve(__dirname, 'src/main'),
      '@common': path.resolve(__dirname, 'src/common'),
      '@renderer': path.resolve(__dirname, 'src/renderer')
    },
    extensions: ['.ts', '.js', '.json' ],
    plugins: [
      new tsConfigPaths({})
    ]
  }
};