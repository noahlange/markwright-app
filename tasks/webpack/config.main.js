// @ts-nocheck
const merge = require('webpack-merge');
const externals = require('webpack-node-externals');
const base = require('./config.base');

module.exports = merge(base, {
  entry: {
    main: './src/main/entry/main.ts'
  },
  externals: [externals()],
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false
  }
});
