// @ts-nocheck
const merge = require('webpack-merge');
const CSS = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const base = require('./config.base');

module.exports = merge(base, {
  entry: {
    renderer: './src/renderer/entry/index.tsx',
    preview: './src/renderer/entry/preview.tsx',
    preload: './src/renderer/entry/preload.ts'
  },
  target: 'electron-renderer',
  plugins: [
    new CSS({
      filename: 'styles/[name].css',
      chunkFilename: 'styles/[id].css'
    }),
    new MonacoWebpackPlugin({
      output: 'workers',
      languages: ['markdown', 'json', 'css', 'scss']
    })
  ],
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'styles/[name].[ext]',
              publicPath: '../'
            }
          }
        ]
      },
      {
        test: /\.(scss|css)$/,
        use: [
          CSS.loader,
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
