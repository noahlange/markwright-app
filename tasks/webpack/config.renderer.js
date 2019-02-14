// @ts-nocheck
const merge = require('webpack-merge');
const base = require('./config.base');

module.exports = merge(base, {
  entry: {
    renderer: './src/renderer/entry/index.tsx',
    preview: './src/renderer/entry/preview.tsx',
    preload: './src/renderer/entry/preload.ts'
  },
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [require('autoprefixer')()]
            }
          }
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { sourceMap: true }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: [require('autoprefixer')()]
            }
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true }
          }
        ]
      }
    ]
  }
});
